import { prisma } from '../config/database';
import { AppError } from '../types';

export class ServiceService {
  async getAll(params?: { categoryId?: string; search?: string; isActive?: boolean }) {
    const where: any = {};

    if (params?.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }

    return prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        category: true,
        staffMembers: {
          include: {
            staff: {
              include: {
                user: {
                  select: { id: true, firstName: true, lastName: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getByIdOrSlug(identifier: string) {
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        staffMembers: {
          include: {
            staff: {
              include: {
                user: {
                  select: { id: true, firstName: true, lastName: true, avatarUrl: true, email: true },
                },
                availabilities: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }
    return service;
  }

  async create(data: {
    categoryId: string;
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    imageUrl?: string;
    preparation?: string;
    aftercare?: string;
    isDisclaimerRequired?: boolean;
    disclaimerText?: string;
    isActive?: boolean;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return prisma.service.create({
      data: {
        ...data,
        slug,
      },
      include: { category: true },
    });
  }

  async update(id: string, data: Partial<{
    categoryId: string;
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    imageUrl?: string;
    preparation?: string;
    aftercare?: string;
    isDisclaimerRequired?: boolean;
    disclaimerText?: string;
    isActive?: boolean;
  }>) {
    const slug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined;
    return prisma.service.update({
      where: { id },
      data: {
        ...data,
        ...(slug ? { slug } : {}),
      },
      include: { category: true },
    });
  }

  async delete(id: string) {
    return prisma.service.delete({ where: { id } });
  }
}

export const serviceService = new ServiceService();
