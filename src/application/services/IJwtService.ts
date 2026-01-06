export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IJwtService {
    generateTokens(payload: object): AuthTokens;
    verifyAccessToken(token: string): any;
    verifyRefreshToken(token: string): any;
}
