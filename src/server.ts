import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors, { CorsOptionsDelegate } from 'cors';
import cookieParser from 'cookie-parser';
import './infrastructure/config/container';
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
  'http://localhost:5174',
  'http://localhost:5175'
];

const corsOptions: CorsOptionsDelegate = (req, callback) => {
  const origin = req.headers.origin as string | undefined;

  console.log('CORS Origin:', origin);

  let corsOptions;

  // Allow requests without origin (Postman, mobile apps)
  if (!origin) {
    corsOptions = { origin: true, credentials: true };
  }
  // Allow if listed or *.vercel.app
  else if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }

  callback(null, corsOptions);
};

// ✅ IMPORTANT FIX FOR CLOUD RUN — Handle preflight OPTIONS
app.options('*', (req, res) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(204);
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database + Seeding
connectDB().then(async () => {
  await seedAdmin();
  await seedLocations();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);

// Error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
