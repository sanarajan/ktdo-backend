
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ktdotech2026_db_user:kTdoTech0026@cluster0.jbqnyue.mongodb.net/ktdo?retryWrites=true&w=majority&appName=ktdo';

async function fixAdmins() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const User = mongoose.model('User', new mongoose.Schema({
            role: String,
            state: String,
            district: String,
            workingState: String,
            workingDistrict: String
        }, { strict: false }));

        // Find District Admins where workingDistrict is missing or empty
        const adminsToFix = await User.find({
            role: 'DISTRICT_ADMIN',
            $or: [
                { workingDistrict: { $exists: false } },
                { workingDistrict: '' },
                { workingDistrict: null }
            ]
        });

        console.log(`Found ${adminsToFix.length} District Admins to update.`);

        for (const admin of adminsToFix) {
            console.log(`Updating ${admin.name} (${admin.email})...`);
            admin.workingState = admin.workingState || admin.state;
            admin.workingDistrict = admin.workingDistrict || admin.district;
            await User.updateOne({ _id: admin._id }, {
                $set: {
                    workingState: admin.workingState,
                    workingDistrict: admin.workingDistrict
                }
            });
        }

        console.log('Update complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error during fix:', err);
        process.exit(1);
    }
}

fixAdmins();
