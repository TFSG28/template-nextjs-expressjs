"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const apicache_1 = __importDefault(require("apicache"));
const middleware_1 = require("./middlewares/middleware");
const app = (0, express_1.default)();
// Rate limiting - apply early to protect against abuse
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // each IP can make up to 200 requests per windowMs (15 minutes)
    standardHeaders: true, // add the RateLimit-* headers to the response
    legacyHeaders: false, // remove the X-RateLimit-* headers from the response
    message: {
        error: 'Too many requests, please try again later.'
    }
});
// Cache middleware
const cache = apicache_1.default.middleware;
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' })); // Add size limit for security
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Apply rate limiting to all requests
app.use(limiter);
// Apply caching before routes
app.use('/', cache('5 minutes'));
// Apply authentication middleware before routes
app.use('/', middleware_1.authMiddleware);
// Routes come last
app.use('/api', routes_1.default);
// Global error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Something went wrong!'
            : err.message
    });
});
exports.default = app;
