import { getCorrelationId, logger } from "@monobank/shared";
import { IAccountRepository } from "./account.repository";
import { Request, Response } from "express";

export class AccountController {
  private accountRepository: IAccountRepository;

  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;

    this.healthCheck = this.healthCheck.bind(this);
  }

  async healthCheck(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "healthcheck");
    res.json({ status: "ok" });
  }
}
