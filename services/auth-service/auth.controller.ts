import { IAuthRepository } from "./auth.repository";

export class AuthController {
  constructor(private authRepository: IAuthRepository) {}

  async findUserByEmail(email: string) {
    return this.authRepository.findUserByEmail(email);
  }

  async createUser(userData: any) {
    return this.authRepository.createUser(userData);
  }

  async findUserById(id: string) {
    return this.authRepository.findUserById(id);
  }

  async updateUser(id: string, userData: any) {
    return this.authRepository.updateUser(id, userData);
  }

  async deleteUser(id: string) {
    return this.authRepository.deleteUser(id);
  }

  async findUserByEmailAndPassword(email: string, password: string) {
    return this.authRepository.findUserByEmailAndPassword(email, password);
  }
}
