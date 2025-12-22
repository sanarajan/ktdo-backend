import { UserRole, ApprovalStatus } from './enums';

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    phone?: string;
    address?: string;
    isBlocked?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    photoUrl?: string;
}

export interface DistrictAdmin extends User {
    district: string;
}

export interface Driver extends User {
    districtAdminId: string;
    licenseNumber: string;
    vehicleNumber: string;
    state?: string;
    district?: string;
    post?: string;
    pin?: string;
    bloodGroup?: string;
    emergencyContact?: string;
    status: ApprovalStatus;
    uniqueId?: string;
    photoUrl?: string;
}

export interface IApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export interface ILogger {
    info(message: string, context?: any): void;
    error(message: string, trace?: string, context?: any): void;
    warn(message: string, context?: any): void;
    debug(message: string, context?: any): void;
}

export interface IStorageService {
    uploadFile(file: any, path: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
}
