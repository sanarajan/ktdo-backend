
require('reflect-metadata');
const mongoose = require('mongoose');
const { MongoUserRepository } = require('./dist/infrastructure/database/repositories/MongoUserRepository');
const { MongoDriverRepository } = require('./dist/infrastructure/database/repositories/MongoDriverRepository');

const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function test() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected');

        const repo = new MongoDriverRepository();

        // Test findAllByRole (used by Main Admin)
        const allMembers = await repo.findAllByRole('MEMBER');
        console.log('Main Admin (findAllByRole):', allMembers.length);

        // Test findByStateAndDistrict (used by District Admin)
        const kozhikodeMembers = await repo.findByStateAndDistrict('Kerala', 'Kozhikode');
        console.log('District Admin (Kozhikode):', kozhikodeMembers.length);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
test();
