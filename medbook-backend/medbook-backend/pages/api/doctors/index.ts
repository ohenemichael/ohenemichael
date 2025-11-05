import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { specialization, search, page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {
      status: 'VERIFIED',
    };

    if (specialization) {
      where.specialization = {
        contains: specialization as string,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        {
          user: {
            firstName: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            lastName: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        },
        {
          specialization: {
            contains: search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
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
            },
          },
        },
        orderBy: [
          { rating: 'desc' },
          { totalReviews: 'desc' },
        ],
      }),
      prisma.doctor.count({ where }),
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
    console.error('Get doctors error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
