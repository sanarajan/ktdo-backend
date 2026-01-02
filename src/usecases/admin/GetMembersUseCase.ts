import { injectable, inject } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserRole } from '../../common/enums';
import { Driver } from '../../domain/entities/Driver';

@injectable()
export class GetMembersUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('IUserRepository') private userRepo: IUserRepository
    ) { }

    async execute(options?: { 
        districtAdminId?: string; 
        state?: string; 
        district?: string;
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{ members: Driver[]; total: number; page: number; totalPages: number }> {
        let { districtAdminId, state, district, page = 1, limit = 10, search = '' } = options || {};

        // If districtAdminId is present but state/district are missing, fetch them from DB
        if (districtAdminId && (!state || !district)) {
            const admin = await this.userRepo.findById(districtAdminId);
            if (admin) {
                state = admin.state;
                district = admin.district;
            }
        }

        let allMembers: Driver[] = [];

        // If a district admin is requesting, show:
        // 1) Members explicitly assigned to this districtAdminId (they added)
        // 2) Members created by members in the same state/district (public registrations)
        if (districtAdminId) {
            // Always try to fetch by district/state if available, even if districtAdminId is present
            // This covers both "assigned to me" and "in my region"
            
            const tasks: Promise<Driver[]>[] = [
                this.driverRepo.findByDistrictAdminId(districtAdminId)
            ];

            if (state && district) {
                tasks.push(this.driverRepo.findByStateAndDistrict(state, district));
            }

            const results = await Promise.all(tasks);
            
            // Flatten results
            const merged = results.flat();

            // Merge unique by _id/id
            const map = new Map<string, Driver>();
            merged.forEach(d => {
                const id = (d as any)._id ? String((d as any)._id) : (d as any).id;
                map.set(id, d as Driver);
            });
            allMembers = Array.from(map.values());
        }
        // Main admin: all members
        else {
            allMembers = (await this.driverRepo.findAllByRole(UserRole.MEMBER)) as Driver[];
        }

        // Apply search filter
        let filteredMembers = allMembers;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredMembers = allMembers.filter(member => 
                member.name.toLowerCase().includes(searchLower) ||
                member.email.toLowerCase().includes(searchLower) ||
                member.phone?.includes(search)
            );
        }

        // Calculate pagination
        const total = filteredMembers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

        return {
            members: paginatedMembers,
            total,
            page,
            totalPages
        };
    }
}
