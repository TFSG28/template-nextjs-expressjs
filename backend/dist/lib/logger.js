"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logWarn = exports.logError = exports.logInfo = exports.requestContextMiddleware = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_transport_1 = __importDefault(require("winston-transport"));
const prisma_1 = require("./prisma");
const async_hooks_1 = require("async_hooks");
// Create AsyncLocalStorage to store request context
const requestContext = new async_hooks_1.AsyncLocalStorage();
// Get the current user ID from request context
const getCurrentUserId = () => {
    var _a;
    const store = requestContext.getStore();
    return ((_a = store === null || store === void 0 ? void 0 : store.req.user) === null || _a === void 0 ? void 0 : _a.id) || 'system';
};
// Middleware to set request context
const requestContextMiddleware = (req, res, next) => {
    requestContext.run({ req }, () => {
        next();
    });
};
exports.requestContextMiddleware = requestContextMiddleware;
// Custom transport for Prisma
class PrismaTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
    }
    log(info, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            setImmediate(() => {
                this.emit('logged', info);
            });
            try {
                // Get user ID from context
                const userId = getCurrentUserId();
                // Store log in database using Prisma
                yield prisma_1.prisma.log.create({
                    data: {
                        level: info.level,
                        message: info.message,
                        metadata: info.metadata || {},
                        createdBy: userId
                    }
                });
            }
            catch (error) {
                console.error('Error saving log to database:', error);
            }
            callback();
        });
    }
}
// Create logger instance
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    defaultMeta: { service: 'api-service' },
    transports: [
        // Console transport for development
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        // Custom Prisma transport
        new PrismaTransport()
    ]
});
// Helper functions for different log levels
const logInfo = (message, metadata) => {
    logger.info(message, { metadata });
};
exports.logInfo = logInfo;
const logError = (message, metadata) => {
    logger.error(message, { metadata });
};
exports.logError = logError;
const logWarn = (message, metadata) => {
    logger.warn(message, { metadata });
};
exports.logWarn = logWarn;
const logDebug = (message, metadata) => {
    logger.debug(message, { metadata });
};
exports.logDebug = logDebug;
exports.default = logger;
