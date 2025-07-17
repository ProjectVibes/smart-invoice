import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string };
    (req as any).user_id = decoded.user_id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
