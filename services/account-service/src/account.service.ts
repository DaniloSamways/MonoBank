import { IAccountRepository } from "./account.repository";

export interface IAccountService {
  transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void>;
}

export class AccountService implements IAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void> {
    const fromAccount = await this.accountRepository.getById(fromAccountId);
    const toAccount = await this.accountRepository.getById(toAccountId);

    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    try {
      await this.accountRepository.customQuery("BEGIN;");

      // Verificar e debitar com row locking
      const debitResult = await this.accountRepository.customQuery(
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
        await this.accountRepository.customQuery("ROLLBACK;");
        throw new Error(`Insufficient funds or account not found`);
      }

      // Creditar
      const creditResult = await this.accountRepository.customQuery(
        `
        UPDATE account
        SET balance = balance + $1
        WHERE id = $2
        RETURNING id, balance
      `,
        [amount, toAccountId],
      );

      if (creditResult.rowCount === 0) {
        await this.accountRepository.customQuery("ROLLBACK");
        throw new Error("Destination account not found");
      }

      await this.accountRepository.customQuery("COMMIT");
    } catch (error) {
      await this.accountRepository.customQuery("ROLLBACK;");
      throw error;
    }
  }
}
