import { getCorrelationId, logger } from "@monobank/shared";
import { IAuthRepository } from "./auth.repository";
import { Request, Response } from "express";

export class AuthController {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;

    this.findUserByEmail = this.findUserByEmail.bind(this);
    this.createUser = this.createUser.bind(this);
    this.findUserById = this.findUserById.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.login = this.login.bind(this);
    this.healthCheck = this.healthCheck.bind(this);
  }

  async findUserByEmail(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "finduserbyemail");
    return this.authRepository.findUserByEmail("");
  }

  async createUser(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "createuser");
    return this.authRepository.createUser({});
  }

  async findUserById(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "finduserbyid");
    return this.authRepository.findUserById("");
  }

  async updateUser(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "updateuser");
    return this.authRepository.updateUser("", {});
  }

  async deleteUser(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "deleteuser");
    return this.authRepository.deleteUser("");
  }

  async login(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "login");
    return this.authRepository.login("", "");
  }

  async healthCheck(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "healthcheck");
    return { status: "ok" };
  }
}
