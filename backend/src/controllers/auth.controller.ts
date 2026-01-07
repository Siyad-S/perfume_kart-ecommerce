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
    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${config.clientUrl}/auth/success`);
});
