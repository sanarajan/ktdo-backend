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
        // legacy fields removed: licenseNumber, vehicleNumber, post, emergencyContact
    post?: string;
    pin?: string;
    bloodGroup?: string;
    licenceNumber?: string;
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
      uploadBuffer(buffer: Buffer, mimeType: string, folder: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
}
