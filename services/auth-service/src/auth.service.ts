import { jwtService } from "@monobank/shared";
import { IAuthRepository } from "./auth.repository";
import { AppDataSource } from "./db";
import { User } from "./entities/user.entity";

export interface IAuthService {
  findByEmail(email: string): Promise<any>;
  create(userData: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(id: string, userData: any): Promise<any>;
  delete(id: string): Promise<void>;
  login(email: string, password: string): Promise<any>;
}

export class AuthService implements IAuthService {
  constructor(private repository: IAuthRepository) {}

  async findByEmail(email: string): Promise<any> {
    return this.repository.findByEmail(email);
  }

  async create(userData: any): Promise<any> {
    const user = this.repository.create(userData);
    return user;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.repository.findByEmail(email);

    if (!user || user.password !== password) {
      throw new Error("401 Invalid credentials");
    }

    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = jwtService.generateRefreshToken({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken: refreshToken,
      expiresIn: 900, // 15 minutos
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async findById(id: string): Promise<any> {
    return this.repository.findById(id);
  }

  async update(id: string, userData: any): Promise<any> {
    return this.repository.update(id, userData);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
