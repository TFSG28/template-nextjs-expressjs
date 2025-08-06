import express, { Application } from 'express';
import routes from './routes';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import apicache from 'apicache';
import { authMiddleware } from './middlewares/middleware';
import logger, { logError, requestContextMiddleware } from './lib/logger';

const app: Application = express();

// Rate limiting - apply early to protect against abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // each IP can make up to 200 requests per windowMs (15 minutes)
    standardHeaders: true, // add the RateLimit-* headers to the response
    legacyHeaders: false, // remove the X-RateLimit-* headers from the response
    message: {
        error: 'Too many requests, please try again later.'
    }
});

// Cache middleware
const cache = apicache.middleware; 

// CORS configuration - be more restrictive in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com', 'https://www.yourdomain.com'] // Replace with your actual domains
        : '*', // Allow all origins in development
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true // Allow cookies/auth headers
};

// Apply middleware in correct order
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Add size limit for security
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

// Request context middleware - must be before authentication
app.use(requestContextMiddleware);

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
            metadata: {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                responseTime: duration,
                ip: req.ip,
                userAgent: req.get('user-agent')
            }
        });
    });
    next();
});

// Apply rate limiting to all requests
app.use(limiter);

// Apply caching before routes
app.use('/', cache('5 minutes'));

// Apply authentication middleware before routes
app.use('/', authMiddleware);

// Routes come last
app.use('/api', routes);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
    logError(err.message, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });
    
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message 
    });
});

export default app;