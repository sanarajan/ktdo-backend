import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import './container'; // Register DI
import { connectDB } from './infrastructure/database/connect';
import { seedAdmin } from './infrastructure/database/seeders/adminSeeder';
import { seedLocations } from './infrastructure/database/seeds/seedLocations';
import authRoutes from './infrastructure/webserver/routes/authRoutes';
import adminRoutes from './infrastructure/webserver/routes/adminRoutes';
import locationRoutes from './infrastructure/webserver/routes/locationRoutes';
import { errorMiddleware } from './infrastructure/webserver/middleware/errorMiddleware';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
