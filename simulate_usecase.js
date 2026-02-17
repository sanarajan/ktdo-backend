
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function simulate() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const role = 'MEMBER';
        const allMembers = await User.find({ role, isDeleted: { $ne: true } }).lean();
        console.log('1. Database returned members:', allMembers.length);

        // Simulation of GetMembersUseCase logic
        let filtered = [...allMembers];
        const search = '';
        const bloodGroup = '';
        const status = '';
        const stateRtoCode = '';

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(member =>
                (member.name?.toLowerCase().includes(searchLower)) ||
                (member.email?.toLowerCase().includes(searchLower)) ||
                (member.phone?.includes(search)) ||
                (member.state?.toLowerCase().includes(searchLower)) ||
                (member.district?.toLowerCase().includes(searchLower))
            );
        }
        console.log('2. After search filter (""):', filtered.length);

        if (bloodGroup) {
            filtered = filtered.filter(member =>
                member.bloodGroup?.toLowerCase() === bloodGroup.toLowerCase()
            );
        }
        console.log('3. After bloodGroup filter (""):', filtered.length);

        if (stateRtoCode) {
            filtered = filtered.filter(member =>
                member.stateRtoCode?.toLowerCase().includes(stateRtoCode.toLowerCase())
            );
        }
        console.log('4. After stateRtoCode filter (""):', filtered.length);

        if (status) {
            filtered = filtered.filter(member =>
                member.status?.toLowerCase() === status.toLowerCase()
            );
        }
        console.log('5. After status filter (""):', filtered.length);

        console.log('Final count:', filtered.length);
        if (filtered.length > 0) {
            console.log('First member status:', filtered[0].status);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
simulate();
