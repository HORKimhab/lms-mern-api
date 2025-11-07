import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    // OneToMany,
    BeforeInsert,
    BeforeUpdate,
  } from 'typeorm';
  import bcrypt from 'bcryptjs';
  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';
//   import { Course } from './Course.entity';
//   import { Payment } from './Payment.entity';



dotenv.config();

  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }

  export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    INACTIVE = 'inactive',
  }

  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    userName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    userEmail: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatarPublicId?: string;

    @Column({ type: 'text', nullable: true })
    avatarSecureUrl?: string;

    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER,
    })
    role: UserRole;

    @Column({ type: 'varchar', length: 255, nullable: true })
    subscriptionId?: string;

    @Column({
      type: 'enum',
      enum: SubscriptionStatus,
      default: SubscriptionStatus.INACTIVE,
    })
    subscriptionStatus: SubscriptionStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    forgotPasswordToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    forgotPasswordExpiry?: Date;

    // @OneToMany(() => Course, (course) => course.creator)
    // courses: Course[];

    // @OneToMany(() => Payment, (payment) => payment.user)
    // payments: Payment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (this.password && !this.password.startsWith('$2')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }

    async comparePassword(plainTextPassword: string): Promise<boolean> {
      return await bcrypt.compare(plainTextPassword, this.password);
    }

    generateJWTToken(): string {
      return jwt.sign(
        { id: this.id, userEmail: this.userEmail, role: this.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: process.env.JWT_EXPIRY ? parseInt(process.env.JWT_EXPIRY, 10) || '7d' : '7d',
        }
      );
    }
  }
