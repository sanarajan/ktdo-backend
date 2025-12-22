import mongoose, { Schema } from 'mongoose';
import { UserRole, ApprovalStatus } from '../../../common/enums';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.MEMBER },
    phone: { type: String },
    address: { type: String },
    isBlocked: { type: Boolean, default: false },
    // District Admin specific
    state: { type: String },
    district: { type: String },
    // Driver specific
    districtAdminId: { type: Schema.Types.ObjectId, ref: 'User' },
    licenseNumber: { type: String },
    vehicleNumber: { type: String },
    post: { type: String },
    pin: { type: String },
    bloodGroup: { type: String },
    emergencyContact: { type: String },
    status: { type: String, enum: Object.values(ApprovalStatus), default: ApprovalStatus.PENDING },
    uniqueId: { type: String },
    photoUrl: { type: String }
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);
