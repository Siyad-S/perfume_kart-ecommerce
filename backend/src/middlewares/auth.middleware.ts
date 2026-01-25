import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import config from '../config/config';

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.cookies.adminAccessToken) {
    token = req.cookies.adminAccessToken;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.cookies.adminAccessToken) {
    token = req.cookies.adminAccessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as CustomJwtPayload;
      req.user = decoded;
    } catch (error) {
      // Token invalid, but it's optional, so just proceed without user
    }
  }
  next();
};

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.adminAccessToken) {
    token = req.cookies.adminAccessToken;
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as CustomJwtPayload;
    req.user = decoded;

    if (decoded.role === 'admin') {
      next();
    } else {
      next(new AppError('You do not have permission to perform this action', 403));
    }
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};


