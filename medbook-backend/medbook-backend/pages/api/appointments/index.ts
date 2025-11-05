import { NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

const createAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  appointmentDate: z.string().datetime(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  reason: z.string().optional(),
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // GET - List appointments
  if (req.method === 'GET') {
    try {
      const { status, page = '1', limit = '10' } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = {};

      // Filter by user role
      if (req.user!.role === 'PATIENT') {
        const patient = await prisma.patient.findUnique({
          where: { userId: req.user!.userId },
        });
        where.patientId = patient?.id;
      } else if (req.user!.role === 'DOCTOR') {
        const doctor = await prisma.doctor.findUnique({
          where: { userId: req.user!.userId },
        });
        where.doctorId = doctor?.id;
      }

      if (status) {
        where.status = status;
      }

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where,
          skip,
          take,
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatar: true,
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
                    phone: true,
                    avatar: true,
                  },
                },
              },
            },
            payment: true,
          },
          orderBy: { appointmentDate: 'desc' },
        }),
        prisma.appointment.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          appointments,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            pages: Math.ceil(total / parseInt(limit as string)),
          },
        },
      });
    } catch (error: any) {
      console.error('Get appointments error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // POST - Create appointment
  if (req.method === 'POST') {
    try {
      const validatedData = createAppointmentSchema.parse(req.body);

      // Get patient
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found',
        });
      }

      // Verify doctor exists and is verified
      const doctor = await prisma.doctor.findUnique({
        where: { id: validatedData.doctorId },
      });

      if (!doctor || doctor.status !== 'VERIFIED') {
        return res.status(400).json({
          success: false,
          message: 'Doctor not available',
        });
      }

      // Check for conflicting appointments
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: validatedData.doctorId,
          appointmentDate: new Date(validatedData.appointmentDate),
          startTime: validatedData.startTime,
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
        },
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked',
        });
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: validatedData.doctorId,
          appointmentDate: new Date(validatedData.appointmentDate),
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          reason: validatedData.reason,
        },
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: { appointment },
      });
    } catch (error: any) {
      console.error('Create appointment error:', error);

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

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

export default withAuth(handler);
