import express from 'express';
import { container } from '../../../container';
import { AuthController } from '../../../adapters/controllers/AuthController';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();
const authController = container.resolve(AuthController);

router.post('/register', upload.single('photo'), (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));

export default router;
