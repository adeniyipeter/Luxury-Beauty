import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError, TokenPayload, UserRole } from '../types';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      throw new AppError('Email address is already in use.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role,
        customerProfile: role === 'CUSTOMER' ? { create: {} } : undefined,
        staffProfile: role === 'STAFF' ? { create: { title: 'Salon Specialist' } } : undefined,
      },
      include: {
        customerProfile: true,
        staffProfile: true,
      },
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const { passwordHash: _, ...userSafe } = user;
    return { user: userSafe, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        customerProfile: true,
        staffProfile: {
          include: {
            services: { include: { service: true } },
            availabilities: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const { passwordHash: _, ...userSafe } = user;
    return { user: userSafe, token };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerProfile: true,
        staffProfile: {
          include: {
            services: { include: { service: true } },
            availabilities: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const { passwordHash: _, ...userSafe } = user;
    return userSafe;
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    address?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        customerProfile: data.address
          ? {
              upsert: {
                create: { address: data.address },
                update: { address: data.address },
              },
            }
          : undefined,
      },
      include: {
        customerProfile: true,
        staffProfile: true,
      },
    });

    const { passwordHash: _, ...userSafe } = updated;
    return userSafe;
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }
}

export const authService = new AuthService();
