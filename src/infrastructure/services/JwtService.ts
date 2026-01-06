import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { AuthTokens, IJwtService } from '../../application/services';

@injectable()
export class JwtService implements IJwtService {
    private readonly accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
    private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    private readonly accessExpiry = '15m';
    private readonly refreshExpiry = '7d';

    generateTokens(payload: object): AuthTokens {
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
