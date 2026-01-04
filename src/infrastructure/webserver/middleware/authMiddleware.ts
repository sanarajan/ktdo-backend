import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../common/enums';
import { container } from '../../../container';
import { JwtService } from '../../auth/JwtService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

const jwtService = container.resolve(JwtService);

export const protect = (roles: UserRole[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers.authorization?.split(' ')[1];

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        try {
            const decoded: any = jwtService.verifyAccessToken(token);
            if (!decoded) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            // Normalize id field from token payload (support id or _id)
            if (decoded._id && !decoded.id) decoded.id = decoded._id;

            // Check if user still exists in database
            const userRepository = container.resolve<IUserRepository>('IUserRepository');
            const user = await userRepository.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User account no longer exists. Please login again.' 
                });
            }

            // Check if user is blocked
            if ((user as any).isBlocked) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Your account has been blocked. Please contact administrator.' 
                });
            }

            (req as any).user = decoded;

            if (roles.length > 0 && !roles.includes((decoded as any).role)) {
                 console.log("middleware err forbid")
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
       
            next();
        } catch (err) {
             console.log("middleware error", err)
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
    };
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Safe cast to any to access user property set by protect
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        next();
    };
};
