import { prisma } from '../config/database';
import { AppError } from '../types';

export class ReviewService {
  async getAll(params?: { isPublished?: boolean; limit?: number }) {
    return prisma.review.findMany({
      where: params?.isPublished !== undefined ? { isPublished: params.isPublished } : undefined,
      take: params?.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
        appointment: {
          include: {
            service: true,
            staff: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
    });
  }

  async create(customerId: string, data: { appointmentId: string; rating: number; comment: string }) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new AppError('Appointment not found.', 404);
    }

    if (appointment.customerId !== customerId) {
      throw new AppError('You can only review appointments you booked.', 403);
    }

    if (appointment.status !== 'COMPLETED') {
      throw new AppError('You can only review completed appointments.', 400);
    }

    const existingReview = await prisma.review.findUnique({
      where: { appointmentId: data.appointmentId },
    });

    if (existingReview) {
      throw new AppError('A review has already been submitted for this appointment.', 409);
    }

    return prisma.review.create({
      data: {
        appointmentId: data.appointmentId,
        customerId,
        rating: data.rating,
        comment: data.comment,
        isPublished: true,
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
        appointment: {
          include: { service: true },
        },
      },
    });
  }

  async updateStatus(id: string, isPublished: boolean) {
    return prisma.review.update({
      where: { id },
      data: { isPublished },
    });
  }

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  }
}

export const reviewService = new ReviewService();
