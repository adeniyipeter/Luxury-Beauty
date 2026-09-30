import { prisma } from '../config/database';
import { AppError } from '../types';

export class StaffService {
  async getAll(params?: { serviceId?: string; isActive?: boolean }) {
    const where: any = {};
    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }
    if (params?.serviceId) {
      where.services = {
        some: { serviceId: params.serviceId },
      };
    }

    return prisma.staffProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true },
        },
        services: {
          include: {
            service: true,
          },
        },
        availabilities: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });
  }

  async getById(id: string) {
    const staff = await prisma.staffProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true },
        },
        services: {
          include: {
            service: true,
          },
        },
        availabilities: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }
    return staff;
  }

  async update(id: string, data: {
    title?: string;
    bio?: string;
    specialty?: string;
    experienceYears?: number;
    isActive?: boolean;
    serviceIds?: string[];
  }) {
    const staff = await prisma.staffProfile.findFirst({
      where: { OR: [{ id }, { userId: id }] },
    });

    if (!staff) {
      throw new AppError('Staff member not found', 404);
    }

    if (data.serviceIds) {
      // Remove old associations and insert new
      await prisma.staffService.deleteMany({
        where: { staffProfileId: staff.id },
      });
      await prisma.staffService.createMany({
        data: data.serviceIds.map((serviceId) => ({
          staffProfileId: staff.id,
          serviceId,
        })),
      });
    }

    return prisma.staffProfile.update({
      where: { id: staff.id },
      data: {
        title: data.title,
        bio: data.bio,
        specialty: data.specialty,
        experienceYears: data.experienceYears,
        isActive: data.isActive,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true } },
        services: { include: { service: true } },
        availabilities: true,
      },
    });
  }

  async setAvailability(staffProfileId: string, schedules: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isWorking: boolean;
  }>) {
    for (const schedule of schedules) {
      await prisma.staffAvailability.upsert({
        where: {
          staffProfileId_dayOfWeek: {
            staffProfileId,
            dayOfWeek: schedule.dayOfWeek,
          },
        },
        update: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isWorking: schedule.isWorking,
        },
        create: {
          staffProfileId,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isWorking: schedule.isWorking,
        },
      });
    }

    return prisma.staffAvailability.findMany({
      where: { staffProfileId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }
}

export const staffService = new StaffService();
