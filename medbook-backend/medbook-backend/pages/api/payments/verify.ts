import { NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { verifyFlutterwavePayment } from '@/lib/payments';

const verifyPaymentSchema = z.object({
  transactionId: z.string(),
  reference: z.string(),
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const validatedData = verifyPaymentSchema.parse(req.body);

    // Find payment by reference
    const payment = await prisma.payment.findUnique({
      where: { reference: validatedData.reference },
      include: {
        appointment: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Verify payment with Flutterwave
    const verificationResponse = await verifyFlutterwavePayment(
      validatedData.transactionId
    );

    if (
      verificationResponse.data.status === 'successful' &&
      verificationResponse.data.tx_ref === validatedData.reference
    ) {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          transactionId: validatedData.transactionId,
        },
      });

      // Update appointment status
      await prisma.appointment.update({
        where: { id: payment.appointmentId },
        data: {
          status: 'CONFIRMED',
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: req.user!.userId,
          title: 'Payment Successful',
          message: 'Your appointment payment has been confirmed',
          type: 'PAYMENT',
          data: {
            appointmentId: payment.appointmentId,
            paymentId: payment.id,
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          payment,
          verified: true,
        },
      });
    } else {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
        },
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: {
          verified: false,
        },
      });
    }
  } catch (error: any) {
    console.error('Verify payment error:', error);

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
