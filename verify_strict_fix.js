
require('reflect-metadata');
const mongoose = require('mongoose');
const { MongoUserRepository } = require('./dist/infrastructure/database/repositories/MongoUserRepository');
const { MongoDriverRepository } = require('./dist/infrastructure/database/repositories/MongoDriverRepository');
const { GetMembersUseCase } = require('./dist/application/usecases/implementation/admin/GetMembersUseCase');

const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function test() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected');

        const driverRepo = new MongoDriverRepository();
        const userRepo = new MongoUserRepository();
        const useCase = new GetMembersUseCase(driverRepo, userRepo);

        // Simulating Kozhikode Admin after database fix
        // They now have workingState: "Kerala", workingDistrict: "Kozhikode"
        const result = await useCase.execute({
            districtAdminId: "697f27da581bc09c730810ce",
            page: 1,
            limit: 10
        });

        console.log('Results for Kozhikode Admin (Strict):', result.members.length);
        result.members.forEach(m => console.log(` - ${m.name} (Working: ${m.workingDistrict})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
test();
