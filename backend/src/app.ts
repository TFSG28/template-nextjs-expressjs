import express, { Application } from 'express';
import routes from './routes';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import apicache from 'apicache'
import { authMiddleware } from './middlewares/middleware'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

const cache = apicache.middleware

const app: Application = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

app.use(express.json());
app.use('/', routes);
// Apply the rate limiting middleware to all requests.
app.use(limiter)
app.use(cache('5 minutes'))
app.use(authMiddleware)

export default app;