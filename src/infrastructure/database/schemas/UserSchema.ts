import mongoose, { Schema } from 'mongoose';
import { UserRole, ApprovalStatus } from '../../../common/enums';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function(this: any) { return this.role !== UserRole.MEMBER } },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.MEMBER },
    phone: { type: String },
    // Address replaced by houseName and place
    houseName: { type: String },
    place: { type: String },
    isBlocked: { type: Boolean, default: false },
    // District Admin specific
    state: { type: String },
    district: { type: String },
    // Driver specific
    districtAdminId: { type: Schema.Types.ObjectId, ref: 'User' },
    pin: { type: String },
    bloodGroup: { type: String },
    // RTO Code fields
    stateCode: { type: String }, // State code like KL, TN, etc.
    rtoCode: { type: String }, // Numeric RTO code like 01, 02, etc.
    stateRtoCode: { type: String }, // Combined code like KL-01, TN-01, etc.
    status: { type: String, enum: Object.values(ApprovalStatus), default: ApprovalStatus.PENDING },
    rejectionReason: { type: String }, // Reason for rejection if status is REJECTED
    uniqueId: { type: String },
    printCount: { type: Number, default: 0 }, // Track number of times ID card was printed
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    photoUrl: { type: String },
    // Who created this member record (MAIN_ADMIN / DISTRICT_ADMIN / MEMBER)
    createdBy: { type: String, enum: Object.values(UserRole), default: UserRole.MEMBER },
    // Optional reference to the user who created this record
    createdById: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);
