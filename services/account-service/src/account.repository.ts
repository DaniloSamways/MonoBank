export interface IAccountRepository {
  transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void>;
  getBalance(accountId: string): Promise<number>;
}

export class AccountRepository implements IAccountRepository {
  transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getBalance(accountId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
