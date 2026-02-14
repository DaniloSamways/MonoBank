import { jwtService } from "@monobank/shared";
import { IAuthRepository } from "../repositories/auth.repository";
import { kafka } from "../lib/kafka";
import { randomUUID } from "node:crypto";

export interface IAuthService {
  findByEmail(email: string): Promise<any>;
  create(userData: any): Promise<any>;
  findById(id: string): Promise<any>;
  update(id: string, userData: any): Promise<any>;
  delete(id: string): Promise<void>;
  login(email: string, password: string): Promise<any>;
}

export class AuthService implements IAuthService {
  private producer = kafka.producer();

  constructor(private repository: IAuthRepository) {}

  async findByEmail(email: string): Promise<any> {
    return this.repository.findByEmail(email);
  }

  async create(userData: any): Promise<any> {
    const user = await this.repository.create(userData);

    if (user) {
      const event = {
        event_id: randomUUID(),
        event_type: "tx.created",
        occurred_at: new Date().toISOString(),
        producer: "auth-service",
        correlation_id: randomUUID(),
        causation_id: null,
        data: user,
      };
      await this.producer.connect();
      await this.producer.send({
        topic: "user.created",
        messages: [
          {
            key: user.id,
            value: JSON.stringify(event),
          },
        ],
      });
      await this.producer.disconnect();
    }

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
    const user = await this.repository.update(id, userData);

    if (user) {
      try {
        await this.producer.connect();
        await this.producer.send({
          topic: "user.updated",
          messages: [
            {
              key: user.id,
              value: JSON.stringify(user),
            },
          ],
        });
        await this.producer.disconnect();
      } catch (err) {
        console.log("ERRO KAFKA", err);
      }
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
