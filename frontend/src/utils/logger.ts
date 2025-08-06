import axios from 'axios';

// API URL for logging - should come from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Log levels
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Interface for the log data
interface LogData {
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

// Function to send logs to server
const sendLogToServer = async (logData: LogData): Promise<void> => {
  try {
    await axios.post(`${API_URL}/logs`, logData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // If sending to server fails, fallback to console logging
    console.error('Failed to send log to server:', error);
    console[logData.level](logData.message, logData.metadata || {});
  }
};

// Client-side logging functions
export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    // Log to console for immediate feedback
    console.info(message, metadata || {});
    
    // In browser environments, send to server
    if (typeof window !== 'undefined') {
      sendLogToServer({ level: 'info', message, metadata });
    }
  },
  
  warn: (message: string, metadata?: Record<string, unknown>) => {
    console.warn(message, metadata || {});
    if (typeof window !== 'undefined') {
      sendLogToServer({ level: 'warn', message, metadata });
    }
  },
  
  error: (message: string, metadata?: Record<string, unknown>) => {
    console.error(message, metadata || {});
    if (typeof window !== 'undefined') {
      sendLogToServer({ level: 'error', message, metadata });
    }
  },
  
  debug: (message: string, metadata?: Record<string, unknown>) => {
    console.debug(message, metadata || {});
    if (typeof window !== 'undefined') {
      sendLogToServer({ level: 'debug', message, metadata });
    }
  }
};

export default logger; 