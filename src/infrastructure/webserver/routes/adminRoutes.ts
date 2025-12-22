import express, { Request, Response, NextFunction } from 'express';
import { container } from '../../../container';
import { AdminController } from '../../../adapters/controllers/AdminController';
import { protect, authorize } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { UserRole } from '../../../common/enums';

const router = express.Router();
const adminController = container.resolve(AdminController);

router.post(
    '/district-admin',
    protect(),
    authorize(UserRole.MAIN_ADMIN),
    upload.single('photo'),
    (req: Request, res: Response, next: NextFunction) => adminController.createDistrictAdmin(req, res, next)
);

router.post(
    '/member',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    upload.single('photo'),
    (req: Request, res: Response, next: NextFunction) => adminController.addMember(req, res, next)
);

router.patch(
    '/block/:userId',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.toggleBlockStatus(req, res, next)
);

router.get(
    '/district-admins',
    protect(),
    authorize(UserRole.MAIN_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.getDistrictAdmins(req, res, next)
);

router.get(
    '/members',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.getMembers(req, res, next)
);

router.patch(
    '/members/:memberId',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    upload.single('photo'),
    (req: Request, res: Response, next: NextFunction) => adminController.updateMember(req, res, next)
);

export default router;

