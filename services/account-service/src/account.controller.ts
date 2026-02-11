import { getCorrelationId, logger } from "@monobank/shared";
import { IAccountRepository } from "./account.repository";
import { Request, Response } from "express";
import { IAccountService } from "./account.service";

export class AccountController {
  constructor(
    private accountService: IAccountService,
    private accountRepository: IAccountRepository,
  ) {
    this.accountRepository = accountRepository;

    this.healthCheck = this.healthCheck.bind(this);
    this.transferFunds = this.transferFunds.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.create = this.create.bind(this);
  }

  async healthCheck(req: Request, res: Response) {
    logger.info({ correlationId: getCorrelationId() }, "healthcheck");
    res.json({ status: "ok" });
  }

  async transferFunds(req: Request, res: Response) {
    const { fromAccountId, toAccountId, amount } = req.body;

    await this.accountService.transferFunds(fromAccountId, toAccountId, amount);

    res.json({
      ok: true,
    });
  }

  async getBalance(req: Request, res: Response) {
    const { accountId } = req.params;

    const account = await this.accountRepository.getById(accountId as string);

    if (!account) {
      res.status(404).json({ error: "Account not found" });
      return;
    }

    res.json({ id: account.id, balance: account.balance });
  }

  async create(req: Request, res: Response) {
    const { userId, currency, type } = req.body;
    const accountData = { userId, currency, type };
    const newAccount = await this.accountRepository.create(accountData);
    res.status(201).json(newAccount);
  }
}
