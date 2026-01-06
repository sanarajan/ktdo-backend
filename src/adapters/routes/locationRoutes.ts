import express, { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/config/container';
import { LocationController } from '../controllers/LocationController';

const router = express.Router();
const locationController = container.resolve(LocationController);

router.get('/states', (req: Request, res: Response, next: NextFunction) => locationController.getStates(req, res, next));
router.get('/districts/:state', (req: Request, res: Response, next: NextFunction) => locationController.getDistricts(req, res, next));
router.get('/state-codes', (req: Request, res: Response, next: NextFunction) => locationController.getStateCodes(req, res, next));

export default router;
