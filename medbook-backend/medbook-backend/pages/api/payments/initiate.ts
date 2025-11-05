import { NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import {
  initiateFlutterwavePayment,
  initiateMTNMoMoPayment,
  generatePaymentReference,
} from '@/lib/payments';

const initiatePaymentSchema = z.object({
  appointmentId: z.string().uuid(),
  method: z.enum(['FLUTTERWAVE', 'MTN_MOBILE_MONEY']),
  phoneNumber: z.string().optional(),
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const validatedData = initiatePaymentSchema.parse(req.body);

    // Get appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: validatedData.appointmentId },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { appointmentId: validatedData.appointmentId },
    });

    if (existingPayment && existingPayment.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this appointment',
      });
    }

    const reference = generatePaymentReference();
    const amount = appointment.doctor.consultationFee;

    let paymentResponse;

    // Initiate payment based on method
    if (validatedData.method === 'FLUTTERWAVE') {
      paymentResponse = await initiateFlutterwavePayment({
        amount,
        email: appointment.patient.user.email,
        phoneNumber: validatedData.phoneNumber || appointment.patient.user.phone || '',
        name: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
        reference,
      });
    } else if (validatedData.method === 'MTN_MOBILE_MONEY') {
      if (!validatedData.phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required for MTN Mobile Money',
        });
      }

      paymentResponse = await initiateMTNMoMoPayment({
        amount,
        email: appointment.patient.user.email,
        phoneNumber: validatedData.phoneNumber,
        name: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
        reference,
      });
    }

    // Create or update payment record
    const payment = await prisma.payment.upsert({
      where: { appointmentId: validatedData.appointmentId },
      update: {
        reference,
        method: validatedData.method,
        paymentDetails: paymentResponse,
      },
      create: {
        appointmentId: validatedData.appointmentId,
        amount,
        method: validatedData.method,
        reference,
        paymentDetails: paymentResponse,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        payment,
        paymentLink: paymentResponse?.data?.link,
      },
    });
  } catch (error: any) {
    console.error('Initiate payment error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}

export default withAuth(handler);
