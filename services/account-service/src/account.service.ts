import { IAccountRepository } from "./account.repository";

export interface IAccountService {
  update(id: string, accountData: any): Promise<any>;
  create({ userId, type }: { userId: string; type: string }): Promise<any>;
  transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void>;
}

export class AccountService implements IAccountService {
  constructor(private repository: IAccountRepository) {}

  async update(id: string, accountData: any): Promise<any> {
    return await this.repository.update(id, accountData);
  }

  async create({ userId, type }: { userId: string; type: string }) {
    const account = await this.repository.create({
      userId,
      type,
      balance: 0,
      currency: "BRL",
    });

    return account;
  }

  async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void> {
    const fromAccount = await this.repository.getById(fromAccountId);
    const toAccount = await this.repository.getById(toAccountId);

    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    try {
      await this.repository.customQuery("BEGIN;");

      // Verificar e debitar com row locking
      const debitResult = await this.repository.customQuery(
        `
        UPDATE account
        SET balance = balance - $1
        WHERE id = $2 
        AND balance >= $1
        RETURNING id, balance
      `,
        [amount, fromAccountId],
      );

      // Nenhuma linha afetada, rollback
      if (debitResult.rowCount === 0) {
        await this.repository.customQuery("ROLLBACK;");
        throw new Error(`Insufficient funds or account not found`);
      }

      // Creditar
      const creditResult = await this.repository.customQuery(
        `
        UPDATE account
        SET balance = balance + $1
        WHERE id = $2
        RETURNING id, balance
      `,
        [amount, toAccountId],
      );

      if (creditResult.rowCount === 0) {
        await this.repository.customQuery("ROLLBACK");
        throw new Error("Destination account not found");
      }

      await this.repository.customQuery("COMMIT");
    } catch (error) {
      await this.repository.customQuery("ROLLBACK;");
      throw error;
    }
  }
}
