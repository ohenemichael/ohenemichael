import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

// Create a new Expo SDK client
const expo = new Expo();

export interface PushNotification {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

/**
 * Send a push notification to a single device
 * @param token - Expo push token
 * @param title - Notification title
 * @param body - Notification body
 * @param data - Additional data payload
 */
export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  // Check that the token is valid
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
    throw new Error('Invalid Expo push token');
  }

  const message: ExpoPushMessage = {
    to: token,
    sound: 'default',
    title,
    body,
    data: data || {},
  };

  try {
    const ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('Push notification sent:', ticket);
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

/**
 * Send push notifications to multiple devices
 * @param tokens - Array of Expo push tokens
 * @param title - Notification title
 * @param body - Notification body
 * @param data - Additional data payload
 */
export async function sendBulkNotifications(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<ExpoPushTicket[]> {
  // Filter out invalid tokens
  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));

  if (validTokens.length === 0) {
    console.warn('No valid Expo push tokens provided');
    return [];
  }

  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data: data || {},
  }));

  try {
    // Split messages into chunks for batch sending
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log(`Sent ${tickets.length} push notifications`);
    return tickets;
  } catch (error) {
    console.error('Error sending bulk push notifications:', error);
    throw error;
  }
}

/**
 * Send appointment reminder notification
 * @param token - Expo push token
 * @param doctorName - Doctor's name
 * @param appointmentDate - Appointment date and time
 */
export async function sendAppointmentReminder(
  token: string,
  doctorName: string,
  appointmentDate: string
): Promise<void> {
  return sendPushNotification(
    token,
    'Appointment Reminder',
    `You have an appointment with Dr. ${doctorName} on ${appointmentDate}`,
    {
      type: 'appointment_reminder',
      doctorName,
      appointmentDate,
    }
  );
}

/**
 * Send appointment confirmation notification
 * @param token - Expo push token
 * @param doctorName - Doctor's name
 * @param appointmentDate - Appointment date and time
 */
export async function sendAppointmentConfirmation(
  token: string,
  doctorName: string,
  appointmentDate: string
): Promise<void> {
  return sendPushNotification(
    token,
    'Appointment Confirmed',
    `Your appointment with Dr. ${doctorName} on ${appointmentDate} has been confirmed`,
    {
      type: 'appointment_confirmation',
      doctorName,
      appointmentDate,
    }
  );
}

/**
 * Send payment confirmation notification
 * @param token - Expo push token
 * @param amount - Payment amount
 * @param reference - Payment reference
 */
export async function sendPaymentConfirmation(
  token: string,
  amount: number,
  reference: string
): Promise<void> {
  return sendPushNotification(
    token,
    'Payment Successful',
    `Your payment of GH₵${amount} has been confirmed. Reference: ${reference}`,
    {
      type: 'payment_confirmation',
      amount,
      reference,
    }
  );
}

/**
 * Send doctor verification notification
 * @param token - Expo push token
 * @param status - Verification status (verified or rejected)
 * @param reason - Rejection reason (if rejected)
 */
export async function sendDoctorVerificationNotification(
  token: string,
  status: 'verified' | 'rejected',
  reason?: string
): Promise<void> {
  const title = status === 'verified' ? 'Profile Verified' : 'Profile Rejected';
  const body =
    status === 'verified'
      ? 'Your doctor profile has been verified and approved!'
      : `Your doctor profile verification was rejected${reason ? ': ' + reason : ''}`;

  return sendPushNotification(token, title, body, {
    type: 'doctor_verification',
    status,
    reason,
  });
}

/**
 * Validate if a token is a valid Expo push token
 * @param token - Token to validate
 */
export function isValidExpoPushToken(token: string): boolean {
  return Expo.isExpoPushToken(token);
}

export default expo;
