
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/driver-app';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const users = await User.find({}).lean();
        console.log('ALL USERS:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
check();
