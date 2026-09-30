import { prisma } from '../config/database';
import { AppError } from '../types';

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

export class AvailabilityService {
  timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  async getAvailableSlots(serviceId: string, staffProfileId: string, dateStr: string): Promise<TimeSlot[]> {
    const targetDate = new Date(`${dateStr}T00:00:00`);
    if (isNaN(targetDate.getTime())) {
      throw new AppError('Invalid date format. Expected YYYY-MM-DD.', 400);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (dateStr < todayStr) {
      return []; // No slots for past dates
    }

    // Verify service
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) {
      throw new AppError('Service not found or is currently inactive', 404);
    }

    // Verify staff
    const staff = await prisma.staffProfile.findFirst({
      where: {
        OR: [{ id: staffProfileId }, { userId: staffProfileId }],
      },
      include: {
        availabilities: true,
        services: true,
      },
    });

    if (!staff || !staff.isActive) {
      throw new AppError('Staff member not found or is currently inactive', 404);
    }

    // Verify staff can perform service
    const canPerform = staff.services.some((s) => s.serviceId === serviceId);
    if (!canPerform) {
      throw new AppError('Staff member is not assigned to perform this service', 400);
    }

    // Check staff availability for day of week
    const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 6 is Saturday
    const daySchedule = staff.availabilities.find((a) => a.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.isWorking) {
      return []; // Staff is off on this day
    }

    const workStart = this.timeToMinutes(daySchedule.startTime);
    const workEnd = this.timeToMinutes(daySchedule.endTime);
    const duration = service.durationMinutes;

    // Fetch existing active appointments for staff on this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        staffId: staff.id,
        date: dateStr,
        status: { in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING'] },
      },
    });

    // Generate slots every 30 minutes
    const step = 30;
    const slots: TimeSlot[] = [];

    // Current time check if booking for today
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let current = workStart; current + duration <= workEnd; current += step) {
      const slotTimeStr = this.minutesToTime(current);
      const slotEndMinutes = current + duration;

      let isAvailable = true;
      let reason: string | undefined = undefined;

      // If today, slot must be in the future
      if (dateStr === todayStr && current <= currentMinutes + 15) {
        isAvailable = false;
        reason = 'Past time';
      }

      // Check for overlap with existing appointments
      if (isAvailable) {
        for (const apt of existingAppointments) {
          const aptStart = this.timeToMinutes(apt.startTime);
          const aptEnd = this.timeToMinutes(apt.endTime);

          // Overlap condition: max(startA, startB) < min(endA, endB)
          if (Math.max(current, aptStart) < Math.min(slotEndMinutes, aptEnd)) {
            isAvailable = false;
            reason = 'Booked';
            break;
          }
        }
      }

      slots.push({
        time: slotTimeStr,
        isAvailable,
        reason,
      });
    }

    return slots;
  }
}

export const availabilityService = new AvailabilityService();
