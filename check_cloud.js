
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function check() {
    try {
        console.log('Connecting to Cloud DB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const count = await User.countDocuments();
        console.log('Total users in Cloud:', count);

        const roles = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        console.log('Roles:', JSON.stringify(roles, null, 2));

        const sample = await User.findOne({ role: 'MEMBER' }).lean();
        if (sample) {
            console.log('Sample Cloud Member:', JSON.stringify({
                id: sample._id,
                name: sample.name,
                role: sample.role,
                isDeleted: sample.isDeleted
            }, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
