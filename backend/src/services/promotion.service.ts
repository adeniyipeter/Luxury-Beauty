import { prisma } from '../config/database';
import { AppError } from '../types';

export class PromotionService {
  async getAll(activeOnly = false) {
    return prisma.promotion.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateCode(code: string) {
    const promo = await prisma.promotion.findFirst({
      where: {
        code: code.toUpperCase().trim(),
        isActive: true,
      },
    });

    if (!promo) {
      throw new AppError('Invalid or expired promotion code.', 404);
    }

    const now = new Date();
    if (promo.startDate && promo.startDate > now) {
      throw new AppError('This promotion has not started yet.', 400);
    }
    if (promo.endDate && promo.endDate < now) {
      throw new AppError('This promotion has expired.', 400);
    }

    return promo;
  }

  async create(data: {
    code: string;
    title: string;
    description?: string;
    discountPercent?: number;
    discountAmount?: number;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
  }) {
    return prisma.promotion.create({
      data: {
        ...data,
        code: data.code.toUpperCase().trim(),
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.promotion.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.promotion.delete({ where: { id } });
  }
}

export const promotionService = new PromotionService();
