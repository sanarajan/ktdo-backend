import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { CreateDistrictAdminUseCase } from '../../usecases/admin/CreateDistrictAdminUseCase';
import { ToggleBlockStatusUseCase } from '../../usecases/admin/ToggleBlockStatusUseCase';
import { AddMemberUseCase } from '../../usecases/admin/AddMemberUseCase';
import { GetDistrictAdminsUseCase } from '../../usecases/admin/GetDistrictAdminsUseCase';
import { DeleteDistrictAdminUseCase } from '../../usecases/admin/DeleteDistrictAdminUseCase';
import { GetMembersUseCase } from '../../usecases/admin/GetMembersUseCase';
import { UpdateMemberUseCase } from '../../usecases/admin/UpdateMemberUseCase';
import { ApproveMemberUseCase } from '../../usecases/admin/ApproveMemberUseCase';
import { RecordPrintIdUseCase } from '../../usecases/admin/RecordPrintIdUseCase';
import { DeleteMemberUseCase } from '../../usecases/admin/DeleteMemberUseCase';
import { HttpCode } from '../../common/enums';
import { SuccessMessage, ErrorMessage } from '../../common/constants';

@injectable()
export class AdminController {
    constructor(
        @inject(CreateDistrictAdminUseCase) private createDistrictAdminUseCase: CreateDistrictAdminUseCase,
        @inject(ToggleBlockStatusUseCase) private toggleBlockStatusUseCase: ToggleBlockStatusUseCase,
        @inject(AddMemberUseCase) private addMemberUseCase: AddMemberUseCase,
        @inject(GetDistrictAdminsUseCase) private getDistrictAdminsUseCase: GetDistrictAdminsUseCase,
        private getMembersUseCase: GetMembersUseCase,
        @inject(DeleteDistrictAdminUseCase) private deleteDistrictAdminUseCase: DeleteDistrictAdminUseCase,
        @inject(UpdateMemberUseCase) private updateMemberUseCase: UpdateMemberUseCase,
        @inject(ApproveMemberUseCase) private approveMemberUseCase: ApproveMemberUseCase,
        @inject(RecordPrintIdUseCase) private recordPrintIdUseCase: RecordPrintIdUseCase,
        @inject(DeleteMemberUseCase) private deleteMemberUseCase: DeleteMemberUseCase
    ) { }

    async createDistrictAdmin(req: Request, res: Response, next: NextFunction) {
        try {
        console.log('File contriler:', (req as any).file);

        const file = (req as any).file; // buffer-based file
            const user = (req as any).user;
            if (user) {
                req.body.createdBy = user.role || 'MEMBER';
                const creatorId = user.id || (user as any)._id || (user as any).userId || (user as any).sub || undefined;
                req.body.createdById = creatorId;
                console.log('Resolved creatorId for district admin creation:', creatorId);
            } else {
                req.body.createdBy = 'MEMBER';
            }

            const admin = await this.createDistrictAdminUseCase.execute(req.body, file);
            res.status(201).json({
                success: true,
                message: 'District Admin created successfully',
                data: admin
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleBlockStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const user = await this.toggleBlockStatusUseCase.execute(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.status(200).json({
                success: true,
                message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async addMember(req: Request, res: Response, next: NextFunction) {
        try {
            const file = (req as any).file;
            // const filePath = (req as any).file?.path;
            const user = (req as any).user;
            // Log for debugging
            console.log('AddMember user new token data:', user);

            // Mark who created this member; support several token ID fields
            if (user) {
                req.body.createdBy = user.role || 'MEMBER';
                const creatorId = user.id || (user as any)._id || (user as any).userId || (user as any).sub || undefined;
                req.body.createdById = creatorId;
                console.log('Resolved creatorId:', creatorId);
            } else {
                req.body.createdBy = 'MEMBER';
            }

            // Enforce District Admin restriction and default status
            if (user && (user.role === 'DISTRICT_ADMIN' || user.role === 'MAIN_ADMIN')) {
                if (user.role === 'DISTRICT_ADMIN') {
                    req.body.state = user.state;
                    req.body.district = user.district;
                    req.body.status = 'APPROVED'; // District Admin-created members are auto-approved
                    // set districtAdminId so GetMembersUseCase can filter by it
                    req.body.districtAdminId = req.body.createdById;
                }
                if (user.role === 'MAIN_ADMIN') {
                    req.body.status = req.body.status || 'APPROVED';
                }
            }


            const member = await this.addMemberUseCase.execute(req.body, file);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: member
            });
        } catch (error) {
            next(error);
        }
    }

    async getDistrictAdmins(req: Request, res: Response, next: NextFunction) {
        try {
            const admins = await this.getDistrictAdminsUseCase.execute();
            res.status(200).json({
                success: true,
                message: 'District Admins retrieved successfully',
                data: admins
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteDistrictAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            const success = await this.deleteDistrictAdminUseCase.execute(adminId);
            if (!success) {
                return res.status(400).json({ success: false, message: 'Failed to delete district admin' });
            }
            res.status(200).json({ success: true, message: 'District admin deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    }

    async getMembers(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the authenticated user from the request (set by protect middleware)
            const user = (req as any).user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || '';
            const bloodGroup = (req.query.bloodGroup as string) || '';
            const stateRtoCode = (req.query.stateRtoCode as string) || '';
            const status = (req.query.status as string) || '';
            
            // If District Admin, fetch by both their assigned members and members in their state/district
            const isDistrictAdmin = user && user.role === 'DISTRICT_ADMIN';
            const districtAdminId = isDistrictAdmin ? user.id : undefined;
            const state = isDistrictAdmin ? user.state : undefined;
            const district = isDistrictAdmin ? user.district : undefined;

            const result = await this.getMembersUseCase.execute({ 
                districtAdminId, 
                state, 
                district,
                page,
                limit,
                search,
                bloodGroup,
                stateRtoCode,
                status
            });
            
            console.log('Members retrieved count:', result.members.length);
            res.status(200).json({
                success: true,
                message: 'Members retrieved successfully',
                data: result.members,
                pagination: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMember(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("reaches update")
            const { memberId } = req.params;
            const updateData = req.body;

            const file = (req as any).file;
            console.log('Update Member Request File:',  (req as any).file);

            const updatedMember = await this.updateMemberUseCase.execute(memberId, updateData, file);
            res.status(200).json({
                success: true,
                message: 'Member updated successfully',
                data: updatedMember
            });
        } catch (error) {
            next(error);
        }
    }

    async approveMember(req: Request, res: Response, next: NextFunction) {
        try {
            const { memberId } = req.params;
            const { action, reason } = req.body; // APPROVED or REJECTED

            if (!action || (action !== 'APPROVED' && action !== 'REJECTED')) {
                return res.status(400).json({ success: false, message: 'Invalid action' });
            }

            const updated = await this.approveMemberUseCase.execute(memberId, action, reason);

            res.status(200).json({
                success: true,
                message: 'Member status updated',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }

    async recordPrintId(req: Request, res: Response, next: NextFunction) {
        try {
            const { memberId } = req.params;
            
            const updated = await this.recordPrintIdUseCase.execute(memberId);

            res.status(200).json({
                success: true,
                message: 'Print count recorded',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMember(req: Request, res: Response, next: NextFunction) {
        try {
            const { memberId } = req.params;

            const result = await this.deleteMemberUseCase.execute(memberId);

            res.status(200).json({
                success: true,
                message: result.softDeleted ? 'Member soft-deleted after print' : 'Member permanently deleted',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
