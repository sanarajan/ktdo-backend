import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/driver-app';

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection failed');

        console.log('Renaming fields in users collection...');
        const result = await db.collection('users').updateMany(
            {},
            {
                $rename: {
                    "state": "workingState",
                    "district": "workingDistrict"
                }
            }
        );

        console.log(`Migration completed successfully.`);
        console.log(`Modified count: ${result.modifiedCount}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
