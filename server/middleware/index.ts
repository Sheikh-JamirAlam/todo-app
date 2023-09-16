import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;
  if (authHeader) {
    const token: string = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY as string, (err, payload) => {
      if (err) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
      if (!payload) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
      if (typeof payload === "string") {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
      req.headers["userId"] = payload.id;
      next();
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
