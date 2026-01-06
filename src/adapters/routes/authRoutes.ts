import express from 'express';
import { container } from '../../infrastructure/config/container';
import { AuthController } from '../controllers/AuthController';
import { upload } from '../../middleware/uploadMiddleware';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();
const authController = container.resolve(AuthController);

router.post('/register', upload.single('photo'), (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/reset-password', protect(), (req, res, next) => authController.resetPassword(req, res, next));

export default router;
