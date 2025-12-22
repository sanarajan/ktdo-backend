import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

@injectable()
export class JwtService {
    private readonly accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
    private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    private readonly accessExpiry = '15m'; // 15 minutes
    private readonly refreshExpiry = '7d'; // 7 days

    generateTokens(payload: object) {
        const accessToken = jwt.sign(payload, this.accessSecret, { expiresIn: this.accessExpiry });
        const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshExpiry });
        return { accessToken, refreshToken };
    }

    verifyAccessToken(token: string) {
        try {
            return jwt.verify(token, this.accessSecret);
        } catch (e) {
            return null;
        }
    }

    verifyRefreshToken(token: string) {
        try {
            return jwt.verify(token, this.refreshSecret);
        } catch (e) {
            return null;
        }
    }
}
