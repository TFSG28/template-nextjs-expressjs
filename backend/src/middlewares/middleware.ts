import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define interface to extend Request type
interface RequestWithUser extends Request {
  user?: JwtPayload;
}

const guestOnlyPaths = ['/login', '/registar', '/forgot-password', '/reset-password'];
// Change this to the paths that are protected
const protectedPaths = ['PATHS'];

function isPathMatching(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => path.startsWith(pattern));
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const token = req.cookies?.token || (req.headers['authorization']?.split(' ')[1] ?? null);

  // Redirect authenticated users away from guest-only paths
  if (token && isPathMatching(path, guestOnlyPaths)) {
    return res.redirect('/dashboard');
  }

  // Allow guests on guest pages
  if (guestOnlyPaths.includes(path)) return next();

  // Allow API routes to continue (rate limiting + referer check)
  if (path.startsWith('/api/')) {
    if (!req.headers.referer?.includes(process.env.APP_URL || '')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return next();
  }

  // Protected routes
  if (isPathMatching(path, protectedPaths)) {
    if (!token) return res.redirect('/login');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      (req as RequestWithUser).user = decoded;
      return next();
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.redirect('/login');
    }
  }

  next();
};
