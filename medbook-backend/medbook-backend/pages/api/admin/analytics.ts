import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest } from '@/middleware/auth';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // Get total counts
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue,
      pendingDoctors,
      currentMonthAppointments,
      lastMonthAppointments,
      currentMonthRevenue,
      lastMonthRevenue,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count({ where: { status: 'VERIFIED' } }),
      prisma.appointment.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.doctor.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      }),
      prisma.appointment.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    // Get appointment statistics by status
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get top doctors by appointments
    const topDoctors = await prisma.doctor.findMany({
      take: 5,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: {
        appointments: {
          _count: 'desc',
        },
      },
    });

    // Get recent appointments
    const recentAppointments = await prisma.appointment.findMany({
      take: 10,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate growth percentages
    const appointmentGrowth = lastMonthAppointments > 0
      ? ((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100
      : 0;

    const revenueGrowth = (lastMonthRevenue._sum.amount || 0) > 0
      ? (((currentMonthRevenue._sum.amount || 0) - (lastMonthRevenue._sum.amount || 0)) / (lastMonthRevenue._sum.amount || 0)) * 100
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          totalRevenue: totalRevenue._sum.amount || 0,
          pendingDoctors,
          currentMonthAppointments,
          appointmentGrowth: appointmentGrowth.toFixed(2),
          currentMonthRevenue: currentMonthRevenue._sum.amount || 0,
          revenueGrowth: revenueGrowth.toFixed(2),
        },
        appointmentsByStatus,
        topDoctors,
        recentAppointments,
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export default withAdmin(handler);
