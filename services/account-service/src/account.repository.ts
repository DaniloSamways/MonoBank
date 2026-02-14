import { AppDataSource } from "./db/index";
import { Account } from "./entities/account.entity";

export interface IAccountRepository {
  getById(accountId: string): Promise<any>;
  update(id: string, accountData: any): Promise<any>;
  create(accountData: any): Promise<any>;
  customQuery(query: string, parameters?: any[]): Promise<any>;
}

export class AccountRepository implements IAccountRepository {
  constructor(private db = AppDataSource.getRepository(Account)) {}

  update(id: string, accountData: any): Promise<any> {
    return this.db.save({ id, ...accountData });
  }

  create(accountData: any): Promise<any> {
    const account = this.db.create(accountData);
    return this.db.save(account);
  }

  getById(accountId: string): Promise<any> {
    return this.db.findOne({
      where: { id: accountId },
    });
  }

  async customQuery(query: string, parameters?: any[]): Promise<any> {
    return this.db.query(query, parameters).then((result) => {
      if (result[1] != undefined) {
        return {
          rows: result[0],
          rowCount: result[1],
        };
      }
    });
  }
}
