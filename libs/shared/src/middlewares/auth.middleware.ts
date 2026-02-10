import { NextFunction, Request, Response } from "express";
import { jwtService } from "../utils";

class AuthMiddleware {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          error: "Token not provided",
        });
      }

      const token = authHeader.split(" ")[1] as string;

      const decoded = jwtService.verifyAccessToken(token);

      //   req.user = user;
      req.token = token;
      // req.tokenPayload = decoded;

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
          code: "TOKEN_EXPIRED",
        });
      }

      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  }
}

export const authMiddleware = new AuthMiddleware();
