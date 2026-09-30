import { prisma } from '../config/database';
import { AppError, UserRole } from '../types';
import { availabilityService } from './availability.service';

export class AppointmentService {
  async bookAppointment(customerId: string, data: {
    serviceId: string;
    staffId: string;
    date: string;
    startTime: string;
    notes?: string;
    promoCode?: string;
    paymentMethod?: string;
  }) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (data.date < todayStr) {
      throw new AppError('Cannot book appointments for past dates.', 400);
    }

    // 1. Fetch & verify service
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { category: true },
    });

    if (!service || !service.isActive) {
      throw new AppError('Service is invalid or not currently available.', 404);
    }

    // 2. Fetch & verify staff
    const staff = await prisma.staffProfile.findFirst({
      where: {
        OR: [{ id: data.staffId }, { userId: data.staffId }],
      },
      include: {
        services: true,
        availabilities: true,
        user: true,
      },
    });

    if (!staff || !staff.isActive) {
      throw new AppError('Selected staff member is not available.', 404);
    }

    // 3. Verify staff performs this service
    const canPerform = staff.services.some((s) => s.serviceId === service.id);
    if (!canPerform) {
      throw new AppError('The selected staff member does not offer this service.', 400);
    }

    // 4. Calculate start and end minutes
    const startMinutes = availabilityService.timeToMinutes(data.startTime);
    const duration = service.durationMinutes;
    const endMinutes = startMinutes + duration;
    const endTime = availabilityService.minutesToTime(endMinutes);

    // 5. Verify staff working hours on this day
    const bookingDate = new Date(`${data.date}T00:00:00`);
    const dayOfWeek = bookingDate.getDay();
    const staffSchedule = staff.availabilities.find((a) => a.dayOfWeek === dayOfWeek);

    if (!staffSchedule || !staffSchedule.isWorking) {
      throw new AppError('The selected staff member is not on duty on this day.', 400);
    }

    const workStart = availabilityService.timeToMinutes(staffSchedule.startTime);
    const workEnd = availabilityService.timeToMinutes(staffSchedule.endTime);

    if (startMinutes < workStart || endMinutes > workEnd) {
      throw new AppError(
        `Appointment time falls outside staff working hours (${staffSchedule.startTime} - ${staffSchedule.endTime}).`,
        400
      );
    }

    // 6. Check for conflict with existing appointments (CRITICAL BOOKING CONFLICT CHECK)
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId: staff.id,
        date: data.date,
        status: { in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING'] },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: data.startTime } },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new AppError(
        'The selected staff member is already booked during this time slot. Please choose another time or specialist.',
        409
      );
    }

    // 7. Calculate final price (handle promo code)
    let finalPrice = service.price;
    if (data.promoCode) {
      const promo = await prisma.promotion.findFirst({
        where: {
          code: data.promoCode.toUpperCase(),
          isActive: true,
        },
      });

      if (promo) {
        if (promo.discountPercent) {
          finalPrice = Math.max(0, finalPrice * (1 - promo.discountPercent / 100));
        } else if (promo.discountAmount) {
          finalPrice = Math.max(0, finalPrice - promo.discountAmount);
        }
      }
    }

    // 8. Generate Appointment Number VEYA-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const count = await prisma.appointment.count();
    const appointmentNumber = `VEYA-${year}-${(count + 1).toString().padStart(4, '0')}-${randomSuffix}`;

    // 9. Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        customerId,
        staffId: staff.id,
        serviceId: service.id,
        date: data.date,
        startTime: data.startTime,
        endTime,
        durationMinutes: duration,
        price: finalPrice,
        status: 'CONFIRMED',
        notes: data.notes,
        paymentStatus: 'PENDING',
        paymentMethod: data.paymentMethod || 'PAY_AT_SALON',
      },
      include: {
        service: true,
        staff: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarUrl: true, phone: true },
            },
          },
        },
        customer: {
          select: { firstName: true, lastName: true, email: true, phone: true },
        },
      },
    });

    // 10. In-App Notification
    await prisma.notification.create({
      data: {
        userId: customerId,
        title: 'Appointment Booked Successfully',
        message: `Your booking for ${service.name} with ${staff.user.firstName} on ${data.date} at ${data.startTime} is confirmed. Ref: ${appointmentNumber}`,
        type: 'BOOKING',
        link: '/customer/appointments',
      },
    });

    return appointment;
  }

  async getAppointments(user: { userId: string; role: UserRole }, filters?: {
    status?: string;
    date?: string;
    staffId?: string;
    customerId?: string;
  }) {
    const where: any = {};

    if (user.role === 'CUSTOMER') {
      where.customerId = user.userId;
    } else if (user.role === 'STAFF') {
      const staff = await prisma.staffProfile.findUnique({ where: { userId: user.userId } });
      if (!staff) return [];
      where.staffId = staff.id;
    } else if (user.role === 'ADMIN') {
      if (filters?.staffId) where.staffId = filters.staffId;
      if (filters?.customerId) where.customerId = filters.customerId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.date) {
      where.date = filters.date;
    }

    return prisma.appointment.findMany({
      where,
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      include: {
        service: { include: { category: true } },
        staff: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true, phone: true } },
          },
        },
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        review: true,
      },
    });
  }

  async getById(id: string, user: { userId: string; role: UserRole }) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: { include: { category: true } },
        staff: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, phone: true } },
          },
        },
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        review: true,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (user.role === 'CUSTOMER' && appointment.customerId !== user.userId) {
      throw new AppError('Access denied.', 403);
    }

    if (user.role === 'STAFF' && appointment.staff.user.id !== user.userId) {
      throw new AppError('Access denied.', 403);
    }

    return appointment;
  }

  async updateStatus(id: string, status: string, user: { userId: string; role: UserRole }, reason?: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        staff: { include: { user: true } },
        customer: true,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (user.role === 'CUSTOMER') {
      if (appointment.customerId !== user.userId) {
        throw new AppError('Access denied.', 403);
      }
      if (status !== 'CANCELLED') {
        throw new AppError('Customers can only cancel appointments.', 403);
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        cancellationReason: status === 'CANCELLED' ? (reason || 'Cancelled by user') : undefined,
        paymentStatus: status === 'COMPLETED' ? 'PAID' : appointment.paymentStatus,
      },
      include: {
        service: true,
        staff: { include: { user: true } },
        customer: true,
      },
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: updated.customerId,
        title: `Appointment Status: ${status}`,
        message: `Your appointment for ${updated.service.name} (${updated.appointmentNumber}) is now marked as ${status}.`,
        type: status === 'CANCELLED' ? 'CANCEL' : 'BOOKING',
        link: '/customer/appointments',
      },
    });

    return updated;
  }

  async reschedule(id: string, user: { userId: string; role: UserRole }, data: { date: string; startTime: string; staffId?: string }) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true, staff: true },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (user.role === 'CUSTOMER' && appointment.customerId !== user.userId) {
      throw new AppError('Access denied.', 403);
    }

    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
      throw new AppError(`Cannot reschedule a ${appointment.status.toLowerCase()} appointment.`, 400);
    }

    const targetStaffId = data.staffId || appointment.staffId;
    const startMinutes = availabilityService.timeToMinutes(data.startTime);
    const endMinutes = startMinutes + appointment.durationMinutes;
    const endTime = availabilityService.minutesToTime(endMinutes);

    // Check conflict
    const conflict = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        staffId: targetStaffId,
        date: data.date,
        status: { in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING'] },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: data.startTime } },
        ],
      },
    });

    if (conflict) {
      throw new AppError('The new time slot conflicts with an existing booking.', 409);
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: data.date,
        startTime: data.startTime,
        endTime,
        staffId: targetStaffId,
        status: 'CONFIRMED',
      },
      include: {
        service: true,
        staff: { include: { user: true } },
        customer: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: appointment.customerId,
        title: 'Appointment Rescheduled',
        message: `Your appointment ${appointment.appointmentNumber} has been rescheduled to ${data.date} at ${data.startTime}.`,
        type: 'REMINDER',
        link: '/customer/appointments',
      },
    });

    return updated;
  }
}

export const appointmentService = new AppointmentService();
