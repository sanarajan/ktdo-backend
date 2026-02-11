import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './infrastructure/config/container'; // Register DI
import { connectDB } from './infrastructure/config/connect';
import { seedAdmin } from './infrastructure/database/seeders/adminSeeder';
import { seedLocations } from './infrastructure/database/seeds/seedLocations';
import authRoutes from './adapters/routes/authRoutes';
import adminRoutes from './adapters/routes/adminRoutes';
import locationRoutes from './adapters/routes/locationRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://ktdo-frontend-fawn.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({

  origin: (origin, callback) => {
    console.log('CORS Origin:', origin);
    // 1. Allow if no origin (like mobile apps/Postman)
    if (!origin) return callback(null, true);

    // 2. Allow if it's in our list OR ends with .vercel.app
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Middleware
// app.use(cors({
//     // Replace the URL below with your actual Vercel deployment URL
//     origin: process.env.NODE_ENV === 'production' 
//             ? 'https://ktdo-frontend.vercel.app' 
//             : 'http://localhost:5173', 
//     credentials: true
// }));
app.use(express.json());
app.use(cookieParser());

// Database
// Database and Seeding
connectDB().then(async () => {
  await seedAdmin();
  await seedLocations();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);

// Error Handling Middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
