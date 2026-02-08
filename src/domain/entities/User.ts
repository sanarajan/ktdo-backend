import { UserRole } from '../../common/enums';

export interface User {
    id: string;
    email: string;
    password?: string; // Optional because we might not pass it around in domain logic always
    name: string;
    role: UserRole;
    phone?: string;
    workingState?: string;
    state?: string;
    district?: string;
    houseName?: string;
    place?: string;
    workingDistrict?: string; // For district admins
    isBlocked?: boolean;
    createdAt: Date;
    updatedAt: Date;
    photoUrl?: string;
    licenceNumber?: string; // Driver's licence number
    createdBy?: string; // role who created this record (e.g., DISTRICT_ADMIN or MEMBER)
    createdById?: string; // optional ID of user who created this record
    isDeleted?: boolean;
    deletedAt?: Date;
}

