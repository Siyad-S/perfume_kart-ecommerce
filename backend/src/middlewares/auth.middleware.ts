import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { responseFormatter } from "../utils/responseFormatter";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Authorization header:", req.headers.authorization);

    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    console.log("Token being verified:", token);

    if (!token) {
      return responseFormatter(res, null, "No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log("Decoded token:", decoded);

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("JWT verify failed:", error);
    return responseFormatter(res, null, "Unauthorized", 401);
  }
};

