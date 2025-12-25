import { UserModel } from '../schemas/UserSchema';
import { UserRole } from '../../../common/enums';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const existingAdmin = await UserModel.findOne({ email: adminEmail });
        if (!existingAdmin) {
            // Hash password
            const hashedPassword = await bcrypt.hash('123456', 10);

            const admin = new UserModel({
                name: 'Main Admin',
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.MAIN_ADMIN,
                phone: '1234567890',
                address: 'Admin Headquarters',
                isBlocked: false
            });

            await admin.save();
          //  console.log('✅ Default Admin Created: admin@gmail.com / 123456');
        } else {
            console.log('ℹ️ Default Admin already exists.');
        }
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
};
