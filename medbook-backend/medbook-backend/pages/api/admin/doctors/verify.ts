import { NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withAdmin, AuthenticatedRequest } from '@/middleware/auth';

const verifyDoctorSchema = z.object({
  doctorId: z.string().uuid(),
  status: z.enum(['VERIFIED', 'REJECTED']),
  reason: z.string().optional(),
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const validatedData = verifyDoctorSchema.parse(req.body);

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: validatedData.doctorId },
      include: {
        user: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Update doctor status
    const updatedDoctor = await prisma.doctor.update({
      where: { id: validatedData.doctorId },
      data: {
        status: validatedData.status,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create notification for doctor
    const notificationMessage = validatedData.status === 'VERIFIED'
      ? 'Your doctor profile has been verified and approved'
      : `Your doctor profile verification was rejected${validatedData.reason ? ': ' + validatedData.reason : ''}`;

    await prisma.notification.create({
      data: {
        userId: doctor.userId,
        title: validatedData.status === 'VERIFIED' ? 'Profile Verified' : 'Profile Rejected',
        message: notificationMessage,
        type: 'VERIFICATION',
        data: {
          doctorId: doctor.id,
          status: validatedData.status,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Doctor ${validatedData.status.toLowerCase()} successfully`,
      data: {
        doctor: updatedDoctor,
      },
    });
  } catch (error: any) {
    console.error('Verify doctor error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export default withAdmin(handler);
