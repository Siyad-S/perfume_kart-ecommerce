import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { responseFormatter } from "../utils/responseFormatter";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if ((req as any).user) {
      return next();
    }
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);
    if (!token) {
      return responseFormatter(res, null, "No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return responseFormatter(res, null, "Unauthorized", 401);
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if ((req as any).user) {
      return next();
    }
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        (req as any).user = decoded;
      } catch (error) {
        console.error("Optional auth: Token invalid", error);
      }
    }
    next();
  } catch (error) {
    console.error("Optional auth: Token invalid", error);
    next();
  }
};

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.adminAccessToken ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return responseFormatter(res, null, "No admin token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'admin') {
      return responseFormatter(res, null, "Not authorized as admin", 403);
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Admin JWT verify failed:", error);
    return responseFormatter(res, null, "Unauthorized", 401);
  }
};

