import { injectable, inject } from 'tsyringe';
import { IDriverRepository } from '../../../../domain/repositories/IDriverRepository';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserRole } from '../../../../common/enums';
import { Driver } from '../../../../domain/entities/Driver';
import { GetMembersOptions, IGetMembersUseCase } from '../../interface/admin/IGetMembersUseCase';

@injectable()
export class GetMembersUseCase implements IGetMembersUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('IUserRepository') private userRepo: IUserRepository
    ) { }

    async execute(options?: GetMembersOptions): Promise<{ members: Driver[]; total: number; page: number; totalPages: number }> {
        let { districtAdminId, state, district, page = 1, limit = 10, search = '', bloodGroup = '', stateRtoCode = '', status = '' } = options || {};

        if (districtAdminId && (!state || !district)) {
            const admin = await this.userRepo.findById(districtAdminId);
            if (admin) {
                state = admin.state;
                district = admin.district;
            }
        }

        let allMembers: Driver[] = [];

        if (districtAdminId) {
            const tasks: Promise<Driver[]>[] = [
                this.driverRepo.findByDistrictAdminId(districtAdminId)
            ];

            if (state && district) {
                tasks.push(this.driverRepo.findByStateAndDistrict(state, district));
            }

            const results = await Promise.all(tasks);

            const merged = results.flat();

            const map = new Map<string, Driver>();
            merged.forEach(d => {
                const id = (d as any)._id ? String((d as any)._id) : (d as any).id;
                map.set(id, d as Driver);
            });
            allMembers = Array.from(map.values());
        }
        else {
            allMembers = (await this.driverRepo.findAllByRole(UserRole.MEMBER)) as Driver[];
        }

        let filteredMembers = allMembers;
        if (search) {
            const searchLower = search.toLowerCase();
            if (districtAdminId) {
                filteredMembers = allMembers.filter(member => 
                    member.name.toLowerCase().includes(searchLower) ||
                    member.email.toLowerCase().includes(searchLower) ||
                    member.phone?.includes(search)
                );
            } else {
                filteredMembers = allMembers.filter(member => 
                    member.name.toLowerCase().includes(searchLower) ||
                    member.email.toLowerCase().includes(searchLower) ||
                    member.phone?.includes(search) ||
                    member.state?.toLowerCase().includes(searchLower) ||
                    member.district?.toLowerCase().includes(searchLower)
                );
            }
        }

        if (bloodGroup) {
            filteredMembers = filteredMembers.filter(member => 
                member.bloodGroup?.toLowerCase() === bloodGroup.toLowerCase()
            );
        }

        if (stateRtoCode) {
            filteredMembers = filteredMembers.filter(member => 
                member.stateRtoCode?.toLowerCase().includes(stateRtoCode.toLowerCase())
            );
        }

        if (status) {
            filteredMembers = filteredMembers.filter(member => 
                member.status?.toLowerCase() === status.toLowerCase()
            );
        }

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
