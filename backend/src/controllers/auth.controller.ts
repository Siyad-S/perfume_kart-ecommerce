import { NextFunction, Request, Response } from 'express';
import { generateTokens } from '../utils/token.utils';
import config from '../config/config';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

//Google callback
export const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
        return next(new AppError('JWT_SECRET or REFRESH_SECRET is missing!', 500));
    }

    const payload = { id: user._id, email: user.email, role: user.role };

    console.log('Google Callback: Logging in user', { id: user._id, email: user.email });

    const { accessToken, refreshToken } = generateTokens(payload);

    const cookieOptions = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookieOptions);

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${config.clientUrl}/auth/success`);
});
