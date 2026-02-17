
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const members = await User.find({ role: 'MEMBER' }).lean();
        console.log('Total members found:', members.length);
        members.forEach(m => {
            console.log(`- Name: ${m.name}, isDeleted: ${m.isDeleted}, role: ${m.role}`);
        });
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
check();
