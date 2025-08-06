"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../lib/logger"));
const router = (0, express_1.Router)();
// POST /api/logs - Endpoint for receiving logs from frontend
router.post('/', (req, res) => {
    try {
        const { level, message, metadata } = req.body;
        // Log with the provided level
        switch (level) {
            case 'info':
                logger_1.default.info(message, { metadata });
                break;
            case 'warn':
                logger_1.default.warn(message, { metadata });
                break;
            case 'error':
                logger_1.default.error(message, { metadata });
                break;
            case 'debug':
                logger_1.default.debug(message, { metadata });
                break;
            default:
                logger_1.default.info(message, { metadata });
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error processing log:', error);
        res.status(500).json({ success: false, error: 'Failed to process log' });
    }
});
exports.default = router;
