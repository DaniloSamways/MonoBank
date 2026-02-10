import { getCorrelationId, logger } from "@monobank/shared";
import { IAccountRepository } from "./account.repository";
import { Request, Response } from "express";

export class AccountController {
  private accountRepository: IAccountRepository;

  constructor(accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;

    this.healthCheck = this.healthCheck.bind(this);
    this.transferFunds = this.transferFunds.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  async healthCheck(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "healthcheck");
    res.json({ status: "ok" });
  }

  async transferFunds(req: Request, res: Response) {
    const { fromAccountId, toAccountId, amount } = req.body;
    await this.accountRepository.transferFunds(
      fromAccountId,
      toAccountId,
      amount,
    );
    res.json({ status: "success" });
  }

  async getBalance(req: Request, res: Response) {
    const { accountId } = req.params;
    const balance = await this.accountRepository.getBalance(
      accountId as string,
    );
    res.json({ balance });
  }
}
