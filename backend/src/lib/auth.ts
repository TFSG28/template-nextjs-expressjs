import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// JWT secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET as string;

// User session type
interface UserSession {
  id: string;
  email: string;
  role?: string;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

// Extract user from JWT token
export function getUserFromToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Get user session from request
export function getAuthSession(req: Request): UserSession | null {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return null;
  }
  
  return getUserFromToken(token);
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const user = jwt.verify(token, JWT_SECRET) as UserSession;
    
    // Attach user to request for later use
    (req as RequestWithUser).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized", message: error });
  }
}

// Middleware for role-based access control
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const user = jwt.verify(token, JWT_SECRET) as UserSession;
      
      if (!user.role || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      }
      
      // Attach user to request for later use
      (req as RequestWithUser).user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized", message: error });
    }
  };
}

// Create JWT token
export function createToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
}