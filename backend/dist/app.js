"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const logger_1 = __importStar(require("./lib/logger"));
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
// Request context middleware - must be before authentication
app.use(logger_1.requestContextMiddleware);
// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.default.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
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
app.use('/', middleware_1.authMiddleware);
// Routes come last
app.use('/api', routes_1.default);
// Global error handler
app.use((err, req, res) => {
    (0, logger_1.logError)(err.message, {
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
exports.default = app;
