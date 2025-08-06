import winston from 'winston';
import Transport from 'winston-transport';
import { prisma } from './prisma';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

// Create AsyncLocalStorage to store request context
const requestContext = new AsyncLocalStorage<{
  req: Request & { user?: { id: string } }
}>();

// Get the current user ID from request context
const getCurrentUserId = (): string => {
  const store = requestContext.getStore();
  return store?.req.user?.id || 'system';
};

// Middleware to set request context
export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  requestContext.run({ req }, () => {
    next();
  });
};

// Custom transport for Prisma
class PrismaTransport extends Transport {
  constructor(opts?: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: winston.LogEntry, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      // Get user ID from context
      const userId = getCurrentUserId();
      
      // Store log in database using Prisma
      await prisma.log.create({
        data: {
          level: info.level,
          message: info.message,
          metadata: info.metadata || {},
          createdBy: userId
        }
      });
    } catch (error) {
      console.error('Error saving log to database:', error);
    }

    callback();
  }
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-service' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Custom Prisma transport
    new PrismaTransport()
  ]
});

// Helper functions for different log levels
export const logInfo = (message: string, metadata?: Record<string, unknown>) => {
  logger.info(message, { metadata });
};

export const logError = (message: string, metadata?: Record<string, unknown>) => {
  logger.error(message, { metadata });
};

export const logWarn = (message: string, metadata?: Record<string, unknown>) => {
  logger.warn(message, { metadata });
};

export const logDebug = (message: string, metadata?: Record<string, unknown>) => {
  logger.debug(message, { metadata });
};

export default logger; 