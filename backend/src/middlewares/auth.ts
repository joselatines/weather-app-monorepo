import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import { JWT_SECRET } from '../config';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      user_id: string;
      username: string;
    };

    // Add user to request
    req.user = {
      user_id: decoded.user_id,
      username: decoded.username
    };

    return next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
