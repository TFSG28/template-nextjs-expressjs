"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const logger_1 = __importDefault(require("./lib/logger"));
const PORT = Number(process.env.PORT) || 3001;
app_1.default.listen(PORT, '0.0.0.0', () => {
    logger_1.default.info(`Server started successfully`, { metadata: { port: PORT, environment: process.env.NODE_ENV || 'development' } });
});
