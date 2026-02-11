import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: "BRL" })
  currency!: string;

  @Column({ type: "enum", enum: ["PF", "PJ"] })
  type!: "PF" | "PJ";

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
