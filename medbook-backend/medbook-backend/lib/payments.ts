import axios from 'axios';

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || '';
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY || '';
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

export interface PaymentInitiationData {
  amount: number;
  email: string;
  phoneNumber: string;
  name: string;
  reference: string;
  currency?: string;
  redirectUrl?: string;
}

export interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data: {
    link?: string;
    id?: string;
    reference?: string;
  };
}

export interface PaymentVerificationResponse {
  status: string;
  message: string;
  data: {
    id: string;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    payment_type: string;
    customer: {
      email: string;
      phone_number: string;
      name: string;
    };
  };
}

// Flutterwave Payment Integration
export async function initiateFlutterwavePayment(
  data: PaymentInitiationData
): Promise<FlutterwavePaymentResponse> {
  try {
    const response = await axios.post(
      `${FLUTTERWAVE_BASE_URL}/payments`,
      {
        tx_ref: data.reference,
        amount: data.amount,
        currency: data.currency || 'GHS',
        redirect_url: data.redirectUrl || process.env.PAYMENT_REDIRECT_URL,
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: data.email,
          phonenumber: data.phoneNumber,
          name: data.name,
        },
        customizations: {
          title: 'MedBook Appointment Payment',
          description: 'Payment for doctor appointment',
          logo: process.env.APP_LOGO_URL || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Flutterwave payment initiation error:', error.response?.data || error.message);
    throw new Error('Failed to initiate payment');
  }
}

// Verify Flutterwave Payment
export async function verifyFlutterwavePayment(
  transactionId: string
): Promise<PaymentVerificationResponse> {
  try {
    const response = await axios.get(
      `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Payment verification error:', error.response?.data || error.message);
    throw new Error('Failed to verify payment');
  }
}

// MTN Mobile Money Payment
export async function initiateMTNMoMoPayment(
  data: PaymentInitiationData
): Promise<FlutterwavePaymentResponse> {
  try {
    const response = await axios.post(
      `${FLUTTERWAVE_BASE_URL}/charges?type=mobile_money_ghana`,
      {
        tx_ref: data.reference,
        amount: data.amount,
        currency: 'GHS',
        network: 'MTN',
        email: data.email,
        phone_number: data.phoneNumber,
        fullname: data.name,
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('MTN MoMo payment error:', error.response?.data || error.message);
    throw new Error('Failed to initiate MTN Mobile Money payment');
  }
}

// Validate MTN Mobile Money Payment
export async function validateMTNMoMoPayment(
  otp: string,
  flwRef: string
): Promise<any> {
  try {
    const response = await axios.post(
      `${FLUTTERWAVE_BASE_URL}/validate-charge`,
      {
        otp,
        flw_ref: flwRef,
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('MTN MoMo validation error:', error.response?.data || error.message);
    throw new Error('Failed to validate MTN Mobile Money payment');
  }
}

export function generatePaymentReference(): string {
  return `MEDBOOK-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
}
