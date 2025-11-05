import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest } from '@/middleware/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where: {
          status: 'PENDING',
        },
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      prisma.doctor.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        doctors,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get pending doctors error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export default withAdmin(handler);
