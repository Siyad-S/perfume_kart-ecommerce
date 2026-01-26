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

    const payload = { _id: user._id, email: user.email, role: user.role };

    const { accessToken, refreshToken } = generateTokens(payload);

    const isSecure = process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false";
    const sameSite = isSecure ? "none" : "lax";

    const cookieOptions = {
        httpOnly: true,
        sameSite: sameSite as "none" | "lax" | "strict",
        secure: isSecure,
        maxAge: 15 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookieOptions);

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const isAdminIntent = req.cookies.admin_login_intent === 'true';
    const redirectUrl = isAdminIntent
        ? `${config.clientUrl}/admin/auth/success`
        : `${config.clientUrl}/auth/success`;

    res.redirect(redirectUrl);
});
