# MedBook - Doctor Appointment Booking System

<div align="center">

![MedBook](https://img.shields.io/badge/MedBook-Doctor%20Appointment%20Booking-149BFF?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-Backend-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Mobile App Guide](#mobile-app-guide)
- [Admin Dashboard](#admin-dashboard)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)

## 🎯 Overview

MedBook is a comprehensive doctor appointment booking system designed specifically for Ghana. It consists of three main components:

1. **Mobile App (React Native/Expo)** - For patients to book appointments
2. **Backend API (Next.js)** - RESTful API with authentication and business logic
3. **Admin Dashboard (Next.js)** - For managing doctors, appointments, and analytics

## ✨ Features

### Patient Features
- ✅ User registration and authentication
- 🔍 Search and filter doctors by specialization
- 📅 Book appointments with available doctors
- 💳 Multiple payment options (Flutterwave, MTN Mobile Money)
- 📱 Push notifications for appointment reminders
- 📄 View medical records and prescriptions
- ⭐ Rate and review doctors

### Doctor Features
- 👨‍⚕️ Professional profile management
- 🗓️ Set availability and working hours
- 📊 View appointments and patient details
- 💰 Track earnings and consultation fees
- ✅ Verification system for credentials

### Admin Features
- 📊 Comprehensive analytics dashboard
- ✅ Doctor verification and approval system
- 👥 User management
- 💵 Payment tracking and reports
- 📈 Revenue analytics with growth metrics
- 🔔 Notification management

## 🛠️ Tech Stack

### Backend
- **Framework**: Next.js 14 (API Routes)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **File Storage**: Firebase Storage
- **Push Notifications**: Firebase Cloud Messaging
- **Payment**: Flutterwave & MTN Mobile Money
- **Styling**: Tailwind CSS

### Mobile App
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Secure Storage**: Expo Secure Store
- **Notifications**: Expo Notifications

## 📁 Project Structure

```
ohenemichael/
├── medbook-backend/          # Next.js Backend & Admin Dashboard
│   ├── pages/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── doctors/      # Doctor management
│   │   │   ├── appointments/ # Appointment booking
│   │   │   ├── payments/     # Payment processing
│   │   │   └── admin/        # Admin endpoints
│   │   ├── index.tsx         # Admin dashboard home
│   │   └── _app.tsx          # App wrapper
│   ├── lib/
│   │   ├── prisma.ts         # Database client
│   │   ├── auth.ts           # Auth utilities
│   │   ├── payments.ts       # Payment integrations
│   │   └── firebase-admin.ts # Firebase admin
│   ├── middleware/
│   │   └── auth.ts           # Auth middleware
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── components/           # React components
│
├── medbook-mobile/           # React Native Mobile App
│   ├── app/
│   │   ├── (auth)/           # Auth screens
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── (tabs)/           # Main app tabs
│   │   │   ├── home.tsx
│   │   │   ├── doctors.tsx
│   │   │   ├── appointments.tsx
│   │   │   └── profile.tsx
│   │   ├── _layout.tsx       # Root layout
│   │   └── index.tsx         # Entry point
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── services/
│   │   ├── api.ts            # API service
│   │   └── auth-context.tsx  # Auth context
│   ├── constants/
│   │   └── theme.ts          # Design system
│   └── app.json              # Expo configuration
│
└── shared/                   # Shared types and utilities
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Firebase project
- Flutterwave account

### Backend Setup

1. **Clone the repository**
```bash
cd medbook-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configurations:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/medbook"
JWT_SECRET="your-super-secret-jwt-key"
FLUTTERWAVE_PUBLIC_KEY="your-flutterwave-public-key"
FLUTTERWAVE_SECRET_KEY="your-flutterwave-secret-key"
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

The backend will be available at `http://localhost:3000`

### Mobile App Setup

1. **Navigate to mobile directory**
```bash
cd medbook-mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

4. **Start Expo development server**
```bash
npm start
```

5. **Run on device/simulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## ⚙️ Configuration

### Database Schema

The database includes the following main models:
- **User**: Base user model with authentication
- **Patient**: Patient-specific data
- **Doctor**: Doctor profiles with verification status
- **Appointment**: Appointment bookings
- **Payment**: Payment transactions
- **MedicalRecord**: Patient medical records
- **Review**: Doctor reviews and ratings
- **Notification**: Push notifications

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging for notifications
3. Enable Storage for file uploads
4. Download service account JSON
5. Add to environment variables

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user (patient or doctor)
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PATIENT"
}
```

#### POST `/api/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user profile (requires authentication)

### Doctor Endpoints

#### GET `/api/doctors`
Get list of verified doctors
Query params: `specialization`, `search`, `page`, `limit`

#### GET `/api/doctors/[id]`
Get doctor details by ID

### Appointment Endpoints

#### GET `/api/appointments`
Get user appointments (requires authentication)

#### POST `/api/appointments`
Create new appointment (requires authentication)
```json
{
  "doctorId": "doctor-uuid",
  "appointmentDate": "2024-01-15T00:00:00.000Z",
  "startTime": "09:00",
  "endTime": "10:00",
  "reason": "Regular checkup"
}
```

### Payment Endpoints

#### POST `/api/payments/initiate`
Initiate payment for appointment
```json
{
  "appointmentId": "appointment-uuid",
  "method": "FLUTTERWAVE",
  "phoneNumber": "+233XXXXXXXXX"
}
```

#### POST `/api/payments/verify`
Verify payment status
```json
{
  "transactionId": "flw-transaction-id",
  "reference": "MEDBOOK-reference"
}
```

### Admin Endpoints

#### GET `/api/admin/analytics`
Get dashboard analytics (requires admin role)

#### GET `/api/admin/doctors/pending`
Get pending doctor verifications

#### POST `/api/admin/doctors/verify`
Verify or reject doctor
```json
{
  "doctorId": "doctor-uuid",
  "status": "VERIFIED",
  "reason": "Optional rejection reason"
}
```

## 📱 Mobile App Guide

### Authentication Flow
1. User opens app
2. If not logged in, redirected to login screen
3. Can register as patient or login
4. After login, redirected to home screen

### Booking Flow
1. Browse doctors on home or doctors screen
2. Select doctor to view profile
3. Choose available time slot
4. Confirm appointment details
5. Proceed to payment
6. Complete payment via Flutterwave or MTN MoMo
7. Receive confirmation and notification

### Payment Methods

#### Flutterwave
- Supports card payments, mobile money, bank transfer
- Redirects to Flutterwave payment page
- Returns to app after payment

#### MTN Mobile Money
- Direct mobile money payment
- Requires OTP validation
- Instant confirmation

## 🎨 Design System

Based on Medics UI Kit with custom modifications:

### Colors
- Primary: `#149BFF` (Blue)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Orange)
- Error: `#EF4444` (Red)

### Components
- **Button**: Primary, secondary, outline, ghost variants
- **Input**: With label, error states, icons
- **Card**: Elevated surfaces with shadows
- **Theme**: Consistent spacing, typography, and colors

## 👨‍💼 Admin Dashboard

Access at: `http://localhost:3000`

### Features
- 📊 Real-time analytics
- 👥 User management
- ✅ Doctor verification
- 💰 Revenue tracking
- 📈 Growth metrics
- 🔔 Notification center

### Analytics Includes
- Total patients, doctors, appointments
- Revenue statistics
- Monthly growth rates
- Appointment status breakdown
- Top performing doctors
- Recent appointments

## 💳 Payment Integration

### Flutterwave Setup
1. Sign up at https://flutterwave.com
2. Get API keys from dashboard
3. Add to environment variables
4. Test with test cards before going live

### MTN Mobile Money
- Integrated via Flutterwave
- Supports Ghana Mobile Money
- Requires phone number validation
- OTP verification for security

## 🚀 Deployment

### Backend Deployment (Vercel)
```bash
cd medbook-backend
vercel --prod
```

### Database (Railway/Heroku)
1. Create PostgreSQL database
2. Update DATABASE_URL in environment
3. Run migrations: `npx prisma db push`

### Mobile App (Expo EAS)
```bash
cd medbook-mobile
eas build --platform all
eas submit --platform all
```

## 🔐 Security Features

- ✅ JWT-based authentication
- 🔒 Password hashing with bcryptjs
- 🛡️ HTTP-only cookies
- 🔑 Secure token storage
- 🚫 CORS configuration
- ✅ Input validation with Zod
- 🔐 Role-based access control

## 📝 Environment Variables

### Backend
```env
DATABASE_URL=              # PostgreSQL connection string
JWT_SECRET=                # Secret key for JWT
FLUTTERWAVE_PUBLIC_KEY=    # Flutterwave public key
FLUTTERWAVE_SECRET_KEY=    # Flutterwave secret key
FIREBASE_SERVICE_ACCOUNT=  # Firebase service account JSON
FIREBASE_STORAGE_BUCKET=   # Firebase storage bucket
PAYMENT_REDIRECT_URL=      # Payment callback URL
APP_LOGO_URL=             # App logo URL
FRONTEND_URL=             # Frontend URL for CORS
NODE_ENV=                 # development/production
```

### Mobile
```env
EXPO_PUBLIC_API_URL=       # Backend API URL
```

## 🧪 Testing

### Backend Tests
```bash
cd medbook-backend
npm test
```

### Mobile App Tests
```bash
cd medbook-mobile
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Michael Ohene**
- Email: ohenemichael37@gmail.com
- GitHub: [@ohenemichael](https://github.com/ohenemichael)

## 🙏 Acknowledgments

- Design inspired by Medics UI Kit
- Payment integration by Flutterwave
- Built with React Native, Next.js, and PostgreSQL

---

<div align="center">

  **Made with ❤️ for better healthcare access in Ghana**

  ⭐ Star this repo if you find it helpful!

</div>
