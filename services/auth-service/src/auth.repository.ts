export interface IAuthRepository {
  findByEmail(email: string): Promise<any>;
  create(userData: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(id: string, userData: any): Promise<any>;
  delete(id: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  findByEmail(email: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  create(userData: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(id: string, userData: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
