
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/driver-app';

console.log('Starting script...');

async function check() {
    try {
        console.log('Connecting to:', MONGO_URI);
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');

        const UserSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.model('User', UserSchema);

        const count = await User.countDocuments();
        console.log('Total users (including admins):', count);

        const roles = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        console.log('Roles distribution:', JSON.stringify(roles, null, 2));

        const deletedCount = await User.countDocuments({ isDeleted: true });
        console.log('Deleted users count:', deletedCount);

        const memberCount = await User.countDocuments({ role: 'MEMBER' });
        console.log('Total members (role: MEMBER):', memberCount);

        const activeMemberCount = await User.countDocuments({ role: 'MEMBER', isDeleted: { $ne: true } });
        console.log('Active members (role: MEMBER, not deleted):', activeMemberCount);

        const districtAdminCount = await User.countDocuments({ role: 'DISTRICT_ADMIN' });
        console.log('Total District Admins:', districtAdminCount);

        const mainAdminCount = await User.countDocuments({ role: 'MAIN_ADMIN' });
        console.log('Total Main Admins:', mainAdminCount);

        const samples = await User.find({ role: 'MEMBER' }).limit(3).lean();
        console.log('Sample members (redacted):', samples.map(s => ({
            id: s._id,
            role: s.role,
            workingState: s.workingState,
            workingDistrict: s.workingDistrict,
            isDeleted: s.isDeleted,
            districtAdminId: s.districtAdminId,
            status: s.status
        })));

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

check();
