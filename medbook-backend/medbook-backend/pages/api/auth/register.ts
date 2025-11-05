import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR']).default('PATIENT'),
  // Doctor-specific fields
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.number().optional(),
  licenseNumber: z.string().optional(),
  consultationFee: z.number().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        role: validatedData.role,
      },
    });

    // Create role-specific profile
    if (validatedData.role === 'PATIENT') {
      await prisma.patient.create({
        data: {
          userId: user.id,
        },
      });
    } else if (validatedData.role === 'DOCTOR') {
      if (!validatedData.specialization || !validatedData.qualification ||
          !validatedData.licenseNumber || !validatedData.experience ||
          !validatedData.consultationFee) {
        return res.status(400).json({
          success: false,
          message: 'Doctor registration requires specialization, qualification, license number, experience, and consultation fee',
        });
      }

      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialization: validatedData.specialization,
          qualification: validatedData.qualification,
          licenseNumber: validatedData.licenseNumber,
          experience: validatedData.experience,
          consultationFee: validatedData.consultationFee,
          languages: ['English'],
        },
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);

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
