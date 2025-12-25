import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { CreateDistrictAdminUseCase } from '../../usecases/admin/CreateDistrictAdminUseCase';
import { ToggleBlockStatusUseCase } from '../../usecases/admin/ToggleBlockStatusUseCase';
import { AddMemberUseCase } from '../../usecases/admin/AddMemberUseCase';
import { GetDistrictAdminsUseCase } from '../../usecases/admin/GetDistrictAdminsUseCase';
import { GetMembersUseCase } from '../../usecases/admin/GetMembersUseCase';
import { UpdateMemberUseCase } from '../../usecases/admin/UpdateMemberUseCase';
import { HttpCode } from '../../common/enums';
import { SuccessMessage, ErrorMessage } from '../../common/constants';

@injectable()
export class AdminController {
    constructor(
        @inject(CreateDistrictAdminUseCase) private createDistrictAdminUseCase: CreateDistrictAdminUseCase,
        @inject(ToggleBlockStatusUseCase) private toggleBlockStatusUseCase: ToggleBlockStatusUseCase,
        @inject(AddMemberUseCase) private addMemberUseCase: AddMemberUseCase,
        @inject(GetDistrictAdminsUseCase) private getDistrictAdminsUseCase: GetDistrictAdminsUseCase,
        @inject(GetMembersUseCase) private getMembersUseCase: GetMembersUseCase,
        @inject(UpdateMemberUseCase) private updateMemberUseCase: UpdateMemberUseCase
    ) { }

    async createDistrictAdmin(req: Request, res: Response, next: NextFunction) {
        try {
        console.log('File contriler:', (req as any).file);

        const file = (req as any).file; // buffer-based file
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

            // Enforce District Admin restriction
            if (user.role === 'DISTRICT_ADMIN') {
                req.body.state = user.state;
                req.body.district = user.district;
                req.body.status = 'APPROVED'; // District Admins approve their own members? Or PENDING? Usually they add approved members.
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

    async getMembers(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the authenticated user from the request (set by protect middleware)
            const user = (req as any).user;

            // If District Admin, filter members by their ID
            // If Main Admin, get all members (no filter)
            const districtAdminId = user.role === 'DISTRICT_ADMIN' ? user.id : undefined;

            const members = await this.getMembersUseCase.execute(districtAdminId);
            res.status(200).json({
                success: true,
                message: 'Members retrieved successfully',
                data: members
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
}
