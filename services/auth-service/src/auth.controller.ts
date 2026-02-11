import { getCorrelationId, jwtService, logger } from "@monobank/shared";
import { IAuthRepository } from "./auth.repository";
import { Request, Response } from "express";

export class AuthController {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;

    this.create = this.create.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.login = this.login.bind(this);
    this.healthCheck = this.healthCheck.bind(this);
  }

  async create(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "create-user");

    const { firstName, lastName, birthDate, email, password } = req.body;

    const user = await this.authRepository.create({
      firstName,
      lastName,
      birthDate,
      email,
      password,
    });

    res.json(user);
  }

  async findById(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "findbyid-user");

    const { id } = req.params;

    const user = await this.authRepository.findById(id as string);
    res.json(user);
  }

  async update(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "update-user");

    const { id } = req.params;

    const { firstName, lastName, birthDate, email, password } = req.body;

    const user = await this.authRepository.update(id as string, {
      firstName,
      lastName,
      birthDate,
      email,
      password,
    });
    res.json(user);
  }

  async delete(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "delete-user");

    const { id } = req.params;

    const result = await this.authRepository.delete(id as string);
    res.json(result);
  }

  async login(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "login-user");

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
    logger.info({ correlationId: getCorrelationId() }, "healthcheck-user");
    res.json({ status: "ok" });
  }
}
