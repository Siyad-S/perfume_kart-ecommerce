import jwt from 'jsonwebtoken';

export const generateTokens = (payload: object) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};
