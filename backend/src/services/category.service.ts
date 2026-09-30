import { prisma } from '../config/database';
import { AppError } from '../types';

export class CategoryService {
  async getAll() {
    return prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { services: true } },
      },
    });
  }

  async getById(id: string) {
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        services: {
          where: { isActive: true },
        },
      },
    });
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async create(data: { name: string; description?: string; imageUrl?: string; sortOrder?: number; isActive?: boolean }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return prisma.serviceCategory.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(id: string, data: Partial<{ name: string; description?: string; imageUrl?: string; sortOrder?: number; isActive?: boolean }>) {
    const slug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined;
    return prisma.serviceCategory.update({
      where: { id },
      data: {
        ...data,
        ...(slug ? { slug } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.serviceCategory.delete({ where: { id } });
  }
}

export const categoryService = new CategoryService();
