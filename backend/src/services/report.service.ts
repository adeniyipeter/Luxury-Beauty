import { prisma } from '../config/database';

export class ReportService {
  async getDashboardMetrics() {
    const todayStr = new Date().toISOString().split('T')[0];

    const [
      todayCount,
      upcomingCount,
      totalCustomers,
      totalStaff,
      completedCount,
      cancelledCount,
      totalRevenueRaw,
      recentAppointments,
    ] = await Promise.all([
      // Today's appointments
      prisma.appointment.count({
        where: { date: todayStr },
      }),
      // Upcoming appointments (today or future, active status)
      prisma.appointment.count({
        where: {
          date: { gte: todayStr },
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      }),
      // Total customers
      prisma.user.count({
        where: { role: 'CUSTOMER' },
      }),
      // Total staff
      prisma.staffProfile.count({
        where: { isActive: true },
      }),
      // Completed appointments
      prisma.appointment.count({
        where: { status: 'COMPLETED' },
      }),
      // Cancelled appointments
      prisma.appointment.count({
        where: { status: 'CANCELLED' },
      }),
      // Revenue from completed or paid appointments
      prisma.appointment.aggregate({
        _sum: { price: true },
        where: {
          OR: [{ status: 'COMPLETED' }, { paymentStatus: 'PAID' }],
        },
      }),
      // 5 most recent appointments
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          service: true,
          customer: { select: { firstName: true, lastName: true, email: true } },
          staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
      }),
    ]);

    return {
      todayAppointments: todayCount,
      upcomingAppointments: upcomingCount,
      totalCustomers,
      totalStaff,
      completedAppointments: completedCount,
      cancelledAppointments: cancelledCount,
      totalRevenue: totalRevenueRaw._sum.price || 0,
      recentAppointments,
    };
  }
}

export const reportService = new ReportService();
