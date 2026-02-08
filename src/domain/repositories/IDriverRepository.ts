import { Driver } from '../entities/Driver';
import { IUserRepository } from './IUserRepository';

export interface IDriverRepository extends IUserRepository {
    findByDistrictAdminId(adminId: string): Promise<Driver[]>;
    findByStateAndDistrict(workingState: string, workingDistrict: string): Promise<Driver[]>;
    updateStatus(driverId: string, status: string): Promise<Driver | null>;
    assignUniqueId(driverId: string, uniqueId: string): Promise<Driver | null>;
    getNextUniqueId(): Promise<string>;
}
