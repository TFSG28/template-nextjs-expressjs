import { Router } from 'express';
import logger from '../lib/logger';

const router = Router();

// POST /api/logs - Endpoint for receiving logs from frontend
router.post('/', (req, res) => {
  try {
    const { level, message, metadata } = req.body;
    
    // Log with the provided level
    switch(level) {
      case 'info':
        logger.info(message, { metadata });
        break;
      case 'warn':
        logger.warn(message, { metadata });
        break;
      case 'error':
        logger.error(message, { metadata });
        break;
      case 'debug':
        logger.debug(message, { metadata });
        break;
      default:
        logger.info(message, { metadata });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing log:', error);
    res.status(500).json({ success: false, error: 'Failed to process log' });
  }
});

export default router; 