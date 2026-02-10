import jwt from "jsonwebtoken";

class JWTService {
  private accessSecret: string;
  private refreshSecret: string;
  private accessExpiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET as string;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    this.accessExpiresIn = "15m";
    this.refreshExpiresIn = "7d";
  }

  generateAccessToken(payload: object): string {
    return jwt.sign(
      {
        ...payload,
        type: "access",
      },
      this.accessSecret,
      { expiresIn: this.accessExpiresIn } as jwt.SignOptions,
    );
  }

  generateRefreshToken(payload: object): string {
    const tokenId = crypto.randomUUID();
    return jwt.sign(
      {
        ...payload,
        type: "refresh",
        tokenId,
      },
      this.refreshSecret,
      { expiresIn: this.refreshExpiresIn } as jwt.SignOptions,
    );
  }

  verifyAccessToken(token: string) {
    try {
    } catch {
      throw new Error("Invalid access token");
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.refreshSecret);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  decodeToken(token: string) {
    return jwt.decode(token);
  }
}

export const jwtService = new JWTService();
