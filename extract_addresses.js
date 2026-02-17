
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const members = await User.find({ role: 'MEMBER' }).lean();
        members.forEach(m => {
            console.log(`Name: ${m.name}`);
            console.log(`  Working: ${m.workingState} / ${m.workingDistrict}`);
            console.log(`  Permanent: ${m.state} / ${m.district}`);
            console.log(`  Status: ${m.status}`);
            console.log(`  IsDeleted: ${m.isDeleted}`);
            console.log('-------------------');
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
