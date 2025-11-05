# MedBook Quick Setup Guide

This guide will help you get MedBook up and running in 10 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Clone and Navigate
```bash
cd ohenemichael
```

### 2. Backend Setup (5 minutes)

#### Install Dependencies
```bash
cd medbook-backend
npm install
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file with your settings:
```env
# Minimum required for local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/medbook"
JWT_SECRET="your-secret-key-change-this"
```

#### Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

#### Start Backend
```bash
npm run dev
```

✅ Backend running at http://localhost:3000

### 3. Mobile App Setup (3 minutes)

Open a new terminal:

```bash
cd medbook-mobile
npm install
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

#### Start Mobile App
```bash
npm start
```

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

✅ Mobile app running!

## Default Test Accounts

After seeding (if implemented):

**Admin Account**
- Email: admin@medbook.com
- Password: admin123

**Doctor Account**
- Email: doctor@medbook.com
- Password: doctor123

**Patient Account**
- Email: patient@medbook.com
- Password: patient123

## Quick Test Checklist

Backend API:
- [ ] Visit http://localhost:3000
- [ ] Test login: POST http://localhost:3000/api/auth/login
- [ ] Get doctors: GET http://localhost:3000/api/doctors

Mobile App:
- [ ] Register new account
- [ ] Login with account
- [ ] Browse doctors
- [ ] View profile

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Create database manually if needed:
```bash
createdb medbook
```

### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset
```

### Mobile App Not Connecting
- Ensure backend is running
- Check EXPO_PUBLIC_API_URL
- Use your computer's IP instead of localhost:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.x:3000/api
```

## Next Steps

1. **Configure Firebase** (for notifications and file storage)
   - Create Firebase project
   - Download service account key
   - Add to FIREBASE_SERVICE_ACCOUNT in .env

2. **Setup Flutterwave** (for payments)
   - Sign up at https://flutterwave.com
   - Get API keys
   - Add to .env

3. **Explore Features**
   - Create doctor account
   - Book an appointment
   - Test payment flow
   - Access admin dashboard

## Development Workflow

### Backend Development
```bash
cd medbook-backend

# Run dev server
npm run dev

# Update database schema
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Mobile Development
```bash
cd medbook-mobile

# Start with cache cleared
npm start -- --clear

# Build for specific platform
npm run android
npm run ios
```

## Production Deployment

### Backend to Vercel
```bash
cd medbook-backend
npm install -g vercel
vercel --prod
```

### Mobile to Expo
```bash
cd medbook-mobile
npm install -g eas-cli
eas build --platform all
```

## Getting Help

- Check PROJECT_DOCUMENTATION.md for detailed docs
- Review code comments
- Check error logs in terminal
- Test API endpoints with Postman

## Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI

# Mobile
npm start            # Start Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run in browser
```

---

**Happy Coding! 🚀**

Need help? Contact: ohenemichael37@gmail.com
