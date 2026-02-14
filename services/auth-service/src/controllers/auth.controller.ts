import { getCorrelationId, jwtService, logger } from "@monobank/shared";
import { Request, Response } from "express";
import { IAuthService } from "./services/auth.service";

export class AuthController {
  constructor(private service: IAuthService) {
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

    const user = await this.service.create({
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

    const user = await this.service.findById(id as string);
    res.json(user);
  }

  async update(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "update-user");

    const { id } = req.params;

    const { firstName, lastName, birthDate, email, password } = req.body;

    const user = await this.service.update(id as string, {
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

    const result = await this.service.delete(id as string);
    res.json(result);
  }

  async login(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "login-user");

    const { email, password } = req.body;

    const login = await this.service.login(email, password);

    res.json(login);
  }

  async healthCheck(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "healthcheck-user");
    res.json({ status: "ok" });
  }
}
