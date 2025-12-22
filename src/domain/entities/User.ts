import { UserRole } from '../../common/enums';

export interface User {
    id: string;
    email: string;
    password?: string; // Optional because we might not pass it around in domain logic always
    name: string;
    role: UserRole;
    phone?: string;
    address?: string;
    licenseNumber?: string; // For members/drivers
    vehicleNumber?: string; // For members/drivers
    district?: string; // For district admins
    isBlocked?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

