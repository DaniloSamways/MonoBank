export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  findUserById(id: string): Promise<any>;
  updateUser(id: string, userData: any): Promise<any>;
  deleteUser(id: string): Promise<void>;
  findUserByEmailAndPassword(email: string, password: string): Promise<any>;
}

class AuthRepository implements IAuthRepository {
  findUserByEmail(email: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  createUser(userData: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findUserById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  updateUser(id: string, userData: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findUserByEmailAndPassword(email: string, password: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
