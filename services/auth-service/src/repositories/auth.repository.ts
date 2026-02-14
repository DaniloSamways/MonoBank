import { AppDataSource } from "../db";
import { User } from "../entities/user.entity";

export interface IAuthRepository {
  findByEmail(email: string): Promise<any>;
  create(userData: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(id: string, userData: any): Promise<any>;
  delete(id: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private db = AppDataSource.getRepository(User)) {}

  async findByEmail(email: string): Promise<any> {
    return this.db.findOne({ where: { email } });
  }

  async create(userData: any): Promise<any> {
    const user = this.db.create(userData);
    return this.db.save(user);
  }

  async findById(id: string): Promise<any> {
    return this.db.findOne({ where: { id } });
  }

  async update(id: string, userData: any): Promise<any> {
    return this.db.save({ id, ...userData });
  }

  async delete(id: string): Promise<void> {
    return this.db.softDelete(id).then(() => {});
  }
}
