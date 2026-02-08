import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { ICreateDistrictAdminUseCase } from '../../application/usecases/interface/admin/ICreateDistrictAdminUseCase';
import { IToggleBlockStatusUseCase } from '../../application/usecases/interface/admin/IToggleBlockStatusUseCase';
import { IAddMemberUseCase } from '../../application/usecases/interface/admin/IAddMemberUseCase';
import { IGetDistrictAdminsUseCase } from '../../application/usecases/interface/admin/IGetDistrictAdminsUseCase';
import { IDeleteDistrictAdminUseCase } from '../../application/usecases/interface/admin/IDeleteDistrictAdminUseCase';
import { IGetMembersUseCase } from '../../application/usecases/interface/admin/IGetMembersUseCase';
import { IUpdateMemberUseCase } from '../../application/usecases/interface/admin/IUpdateMemberUseCase';
import { IApproveMemberUseCase } from '../../application/usecases/interface/admin/IApproveMemberUseCase';
import { IRecordPrintIdUseCase } from '../../application/usecases/interface/admin/IRecordPrintIdUseCase';
import { IDeleteMemberUseCase } from '../../application/usecases/interface/admin/IDeleteMemberUseCase';
import { StatusCode, SuccessMessage, ErrorMessage } from '../../common/constants';

@injectable()
export class AdminController {
    constructor(
        @inject('ICreateDistrictAdminUseCase') private createDistrictAdminUseCase: ICreateDistrictAdminUseCase,
        @inject('IToggleBlockStatusUseCase') private toggleBlockStatusUseCase: IToggleBlockStatusUseCase,
        @inject('IAddMemberUseCase') private addMemberUseCase: IAddMemberUseCase,
        @inject('IGetDistrictAdminsUseCase') private getDistrictAdminsUseCase: IGetDistrictAdminsUseCase,
        @inject('IGetMembersUseCase') private getMembersUseCase: IGetMembersUseCase,
        @inject('IDeleteDistrictAdminUseCase') private deleteDistrictAdminUseCase: IDeleteDistrictAdminUseCase,
        @inject('IUpdateMemberUseCase') private updateMemberUseCase: IUpdateMemberUseCase,
        @inject('IApproveMemberUseCase') private approveMemberUseCase: IApproveMemberUseCase,
        @inject('IRecordPrintIdUseCase') private recordPrintIdUseCase: IRecordPrintIdUseCase,
        @inject('IDeleteMemberUseCase') private deleteMemberUseCase: IDeleteMemberUseCase
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
            res.status(StatusCode.CREATED).json({
                success: true,
                message: SuccessMessage.DISTRICT_ADMIN_CREATED,
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
                return res.status(StatusCode.NOT_FOUND).json({ success: false, message: ErrorMessage.USER_NOT_FOUND });
            }
            res.status(StatusCode.OK).json({
                success: true,
                message: user.isBlocked ? SuccessMessage.USER_BLOCKED : SuccessMessage.USER_UNBLOCKED,
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
            console.log('AddMember req.body:', req.body);
            console.log('AddMember licenceNumber:', req.body.licenceNumber);

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
                    req.body.workingState = user.workingState;
                    req.body.workingDistrict = user.workingDistrict;
                    req.body.status = 'APPROVED'; // District Admin-created members are auto-approved
                    // set districtAdminId so GetMembersUseCase can filter by it
                    req.body.districtAdminId = req.body.createdById;
                }
                if (user.role === 'MAIN_ADMIN') {
                    req.body.status = req.body.status || 'APPROVED';
                }
            }


            const member = await this.addMemberUseCase.execute(req.body, file);
            res.status(StatusCode.CREATED).json({
                success: true,
                message: SuccessMessage.MEMBER_ADDED,
                data: member
            });
        } catch (error) {
            next(error);
        }
    }

    async getDistrictAdmins(req: Request, res: Response, next: NextFunction) {
        try {
            const admins = await this.getDistrictAdminsUseCase.execute();
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.DISTRICT_ADMINS_RETRIEVED,
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
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: ErrorMessage.DELETE_DISTRICT_ADMIN_FAILED });
            }
            res.status(StatusCode.OK).json({ success: true, message: SuccessMessage.DISTRICT_ADMIN_DELETED });
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
            const state = isDistrictAdmin ? user.workingState : undefined;
            const district = isDistrictAdmin ? user.workingDistrict : undefined;

            const result = await this.getMembersUseCase.execute({
                districtAdminId,
                workingState: state,
                workingDistrict: district,
                page,
                limit,
                search,
                bloodGroup,
                stateRtoCode,
                status
            });

            console.log('Members retrieved count:', result.members.length);
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.MEMBERS_RETRIEVED,
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
            console.log('UpdateMember req.body:', req.body);
            console.log('UpdateMember licenceNumber:', req.body.licenceNumber);

            const file = (req as any).file;
            console.log('Update Member Request File:', (req as any).file);

            const updatedMember = await this.updateMemberUseCase.execute(memberId, updateData, file);
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.MEMBER_UPDATED,
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
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: ErrorMessage.INVALID_ACTION });
            }

            const updated = await this.approveMemberUseCase.execute(memberId, action, reason);

            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.MEMBER_STATUS_UPDATED,
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

            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessage.PRINT_COUNT_RECORDED,
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

            res.status(StatusCode.OK).json({
                success: true,
                message: result.softDeleted ? SuccessMessage.MEMBER_SOFT_DELETED : SuccessMessage.MEMBER_DELETED,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
