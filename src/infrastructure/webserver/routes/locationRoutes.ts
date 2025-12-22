import express, { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { LocationController } from '../../../adapters/controllers/LocationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const locationController = container.resolve(LocationController);

router.get('/states', protect(), (req: Request, res: Response, next: NextFunction) => locationController.getStates(req, res, next));
router.get('/districts/:state', protect(), (req: Request, res: Response, next: NextFunction) => locationController.getDistricts(req, res, next));

export default router;
