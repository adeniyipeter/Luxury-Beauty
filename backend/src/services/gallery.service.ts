import { prisma } from '../config/database';
import { AppError } from '../types';

export class GalleryService {
  async getAll(params?: { category?: string; isFeatured?: boolean }) {
    const where: any = {};
    if (params?.category && params.category !== 'All') {
      where.category = params.category;
    }
    if (params?.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    return prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { title: string; category: string; imageUrl: string; description?: string; isFeatured?: boolean }) {
    return prisma.galleryImage.create({ data });
  }

  async delete(id: string) {
    return prisma.galleryImage.delete({ where: { id } });
  }
}

export const galleryService = new GalleryService();
