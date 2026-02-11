import { getCorrelationId, jwtService, logger } from "@monobank/shared";
import { IAuthRepository } from "./auth.repository";
import { Request, Response } from "express";

export class AuthController {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;

    this.createUser = this.createUser.bind(this);
    this.findUserById = this.findUserById.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.login = this.login.bind(this);
    this.healthCheck = this.healthCheck.bind(this);
  }

  async createUser(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "createuser");
    return this.authRepository.create({});
  }

  async findUserById(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "finduserbyid");
    return this.authRepository.findById("");
  }

  async updateUser(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "updateuser");
    return this.authRepository.update("", {});
  }

  async deleteUser(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "deleteuser");
    return this.authRepository.delete("");
  }

  async login(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "login");

    const { email, password } = req.body;

    const user = await this.authRepository.findByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = jwtService.generateRefreshToken({
      userId: user.id,
    });

    res.json({
      accessToken,
      refreshToken: refreshToken,
      expiresIn: 900, // 15 minutos
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async healthCheck(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "healthcheck");
    res.json({ status: "ok" });
  }
}
