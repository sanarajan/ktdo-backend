import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../common/enums';
import { container } from '../../../container';
import { JwtService } from '../../auth/JwtService';

const jwtService = container.resolve(JwtService);

export const protect = (roles: UserRole[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("middleware reached")
        let token = req.headers.authorization?.split(' ')[1];

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            console.log("no token")
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        try {
            const decoded = jwtService.verifyAccessToken(token);
            if (!decoded) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
            (req as any).user = decoded;

            if (roles.length > 0 && !roles.includes((decoded as any).role)) {
                 console.log("middleware err forbid")
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
       
 console.log("middleware out success")
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
