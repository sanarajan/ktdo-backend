import 'reflect-metadata';
import { container } from 'tsyringe';
import { MongoDriverRepository } from './src/infrastructure/database/repositories/MongoDriverRepository';
import { connectDB } from './src/infrastructure/database/connect';
import dotenv from 'dotenv';

dotenv.config();

const testRepo = async () => {
    try {
        await connectDB();
        
        const repo = new MongoDriverRepository();
        
        const adminId = '6950d17f7a3eacc06dd317e6'; // sana
        const state = 'Kerala';
        const district = 'Kozhikode';

        console.log(`Testing findByDistrictAdminId('${adminId}')...`);
        const byAdmin = await repo.findByDistrictAdminId(adminId);
        console.log(`Found ${byAdmin.length} members by admin ID.`);

        console.log(`Testing findByStateAndDistrict('${state}', '${district}')...`);
        const byRegion = await repo.findByStateAndDistrict(state, district);
        console.log(`Found ${byRegion.length} members by region.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testRepo();
