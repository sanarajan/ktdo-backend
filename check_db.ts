import mongoose from 'mongoose';
import Location from './src/infrastructure/database/schemas/LocationSchema';
import { connectDB } from './src/infrastructure/database/connect';
import dotenv from 'dotenv';
dotenv.config();

const checkData = async () => {
    try {
        await connectDB();
        const count = await Location.countDocuments();
        console.log(`Total Locations found: ${count}`);

        if (count > 0) {
            const sample = await Location.findOne();
            console.log('Sample Location:', JSON.stringify(sample, null, 2));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
};

checkData();
