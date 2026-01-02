import { Request, Response } from 'express';
import { generateTokens } from '../utils/token.utils';

//Google callback
export const googleCallback = async (req: Request, res: Response) => {
    const user = req.user as any;

    if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
        console.error('JWT_SECRET or REFRESH_SECRET is missing!');
        res.status(500).send('Internal Server Error');
        return;
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

    const clientUrl = process.env.CLIENT_URL;
    res.redirect(`${clientUrl}/auth/success`);
};
