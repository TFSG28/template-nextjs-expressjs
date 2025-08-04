"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = getUserFromToken;
exports.getAuthSession = getAuthSession;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.createToken = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET;
// Extract user from JWT token
function getUserFromToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
// Get user session from request
function getAuthSession(req) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return null;
    }
    return getUserFromToken(token);
}
// Middleware to require authentication
function requireAuth(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach user to request for later use
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized", message: error });
    }
}
// Middleware for role-based access control
function requireRole(allowedRoles) {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (!user.role || !allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }
            // Attach user to request for later use
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: "Unauthorized", message: error });
        }
    };
}
// Create JWT token
function createToken(user) {
    return jsonwebtoken_1.default.sign(user, JWT_SECRET, { expiresIn: '1d' });
}
