import { Driver } from '../../../../domain/entities/Driver';

export interface GetMembersOptions {
    districtAdminId?: string;
    state?: string;
    district?: string;
    page?: number;
    limit?: number;
    search?: string;
    bloodGroup?: string;
    stateRtoCode?: string;
    status?: string;
}

export interface IGetMembersUseCase {
    execute(options?: GetMembersOptions): Promise<{ members: Driver[]; total: number; page: number; totalPages: number }>;
}
