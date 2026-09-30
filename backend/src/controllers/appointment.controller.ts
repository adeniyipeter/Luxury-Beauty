import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { appointmentService } from '../services/appointment.service';
import { availabilityService } from '../services/availability.service';
import { reviewService } from '../services/review.service';

export class AppointmentController {
  async book(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.bookAppointment(req.user!.userId, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Appointment booked successfully',
        data: { appointment },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, date, staffId, customerId } = req.query;
      const appointments = await appointmentService.getAppointments(
        { userId: req.user!.userId, role: req.user!.role },
        {
          status: status as string,
          date: date as string,
          staffId: staffId as string,
          customerId: customerId as string,
        }
      );
      res.status(200).json({ status: 'success', data: { appointments } });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.getById(req.params.id, {
        userId: req.user!.userId,
        role: req.user!.role,
      });
      res.status(200).json({ status: 'success', data: { appointment } });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, cancellationReason } = req.body;
      const appointment = await appointmentService.updateStatus(
        req.params.id,
        status,
        { userId: req.user!.userId, role: req.user!.role },
        cancellationReason
      );
      res.status(200).json({
        status: 'success',
        message: `Appointment updated to ${status}`,
        data: { appointment },
      });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { cancellationReason } = req.body;
      const appointment = await appointmentService.updateStatus(
        req.params.id,
        'CANCELLED',
        { userId: req.user!.userId, role: req.user!.role },
        cancellationReason
      );
      res.status(200).json({
        status: 'success',
        message: 'Appointment cancelled',
        data: { appointment },
      });
    } catch (err) {
      next(err);
    }
  }

  async confirm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.updateStatus(
        req.params.id,
        'CONFIRMED',
        { userId: req.user!.userId, role: req.user!.role }
      );
      res.status(200).json({
        status: 'success',
        message: 'Appointment confirmed',
        data: { appointment },
      });
    } catch (err) {
      next(err);
    }
  }

  async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.updateStatus(
        req.params.id,
        'COMPLETED',
        { userId: req.user!.userId, role: req.user!.role }
      );
      res.status(200).json({
        status: 'success',
        message: 'Appointment marked as completed',
        data: { appointment },
      });
    } catch (err) {
      next(err);
    }
  }

  async reschedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.reschedule(
        req.params.id,
        { userId: req.user!.userId, role: req.user!.role },
        req.body
      );
      res.status(200).json({
        status: 'success',
        message: 'Appointment rescheduled successfully',
        data: { appointment },
      });
    } catch (err) {
      next(err);
    }
  }
}

export class AvailabilityController {
  async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, staffId, date } = req.query;
      if (!serviceId || !staffId || !date) {
        return res.status(400).json({
          status: 'error',
          message: 'serviceId, staffId, and date query parameters are required',
        });
      }

      const slots = await availabilityService.getAvailableSlots(
        serviceId as string,
        staffId as string,
        date as string
      );
      res.status(200).json({ status: 'success', data: { slots } });
    } catch (err) {
      next(err);
    }
  }
}

export class ReviewController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewService.getAll({ isPublished: true });
      res.status(200).json({ status: 'success', data: { reviews } });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.create(req.user!.userId, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Thank you for your feedback! Your review has been posted.',
        data: { review },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.updateStatus(req.params.id, req.body.isPublished);
      res.status(200).json({ status: 'success', data: { review } });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await reviewService.delete(req.params.id);
      res.status(200).json({ status: 'success', message: 'Review deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export const appointmentController = new AppointmentController();
export const availabilityController = new AvailabilityController();
export const reviewController = new ReviewController();
