import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1, 'Service is required'),
    staffId: z.string().min(1, 'Staff member is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be formatted as HH:MM'),
    notes: z.string().max(500).optional(),
    promoCode: z.string().optional(),
    paymentMethod: z.enum(['PAY_AT_SALON', 'CARD', 'ONLINE']).optional().default('PAY_AT_SALON'),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
    cancellationReason: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const rescheduleAppointmentSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be formatted as HH:MM'),
    staffId: z.string().optional(),
  }),
});

export const createReviewSchema = z.object({
  body: z.object({
    appointmentId: z.string().min(1, 'Appointment ID is required'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(5, 'Review comment must be at least 5 characters'),
  }),
});

export const createAvailabilitySchema = z.object({
  body: z.object({
    staffProfileId: z.string().min(1, 'Staff profile ID is required'),
    dayOfWeek: z.number().int().min(0).max(6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time format HH:MM'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time format HH:MM'),
    isWorking: z.boolean().default(true),
  }),
});
