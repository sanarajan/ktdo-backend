import express, { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/config/container';
import { AdminController } from '../controllers/AdminController';
import { protect, authorize } from '../../middleware/authMiddleware';
import { upload } from '../../middleware/uploadMiddleware';
import { UserRole } from '../../common/enums';

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

router.delete(
    '/district-admin/:adminId',
    protect(),
    authorize(UserRole.MAIN_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.deleteDistrictAdmin(req, res, next)
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

// Approve or reject a member (status + uniqueId assignment on approve)
router.patch(
    '/members/:memberId/status',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.approveMember(req, res, next)
);

// Record print ID count
router.post(
    '/members/:memberId/print-record',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.recordPrintId(req, res, next)
);

// Delete member (soft delete if already printed)
router.delete(
    '/members/:memberId',
    protect(),
    authorize(UserRole.MAIN_ADMIN, UserRole.DISTRICT_ADMIN),
    (req: Request, res: Response, next: NextFunction) => adminController.deleteMember(req, res, next)
);

export default router;
