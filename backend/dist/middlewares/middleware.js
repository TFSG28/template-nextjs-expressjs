"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const guestOnlyPaths = ['/login', '/forgot-password', '/reset-password', '/register'];
// Change this to the paths that are protected
const protectedPaths = ['PATHS'];
function isPathMatching(path, patterns) {
    return patterns.some((pattern) => path.startsWith(pattern));
}
const authMiddleware = (req, res, next) => {
    var _a, _b, _c, _d;
    const path = req.path;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_c = (_b = req.headers['authorization']) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) !== null && _c !== void 0 ? _c : null);
    // Redirect authenticated users away from guest-only paths
    if (token && isPathMatching(path, guestOnlyPaths)) {
        return res.redirect('/dashboard');
    }
    // Allow guests on guest pages
    if (guestOnlyPaths.includes(path))
        return next();
    // Allow API routes to continue (rate limiting + referer check)
    if (path.startsWith('/api/')) {
        if (!((_d = req.headers.referer) === null || _d === void 0 ? void 0 : _d.includes(process.env.APP_URL || ''))) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return next();
    }
    // Protected routes
    if (isPathMatching(path, protectedPaths)) {
        if (!token)
            return res.redirect('/login');
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        }
        catch (err) {
            console.error('JWT verification error:', err);
            return res.redirect('/login');
        }
    }
    next();
};
exports.authMiddleware = authMiddleware;
