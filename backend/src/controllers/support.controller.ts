import { NextFunction, Request, Response } from 'express';
import { sendEmail } from '../services/mailer.service';
import { responseFormatter } from '../utils/responseFormatter';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// contact support
export const contactSupport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
        return next(new AppError("Please provide name, email, and message", 400));
    }

    const supportEmail = process.env.SUPPORT_MAIL;

    if (!supportEmail) {
        return next(new AppError("Support email configuration missing", 500));
    }

    await sendEmail(
        supportEmail,
        subject ? `Contact Us Request from ${name}` : `Support Request from ${name}`,
        subject ? 'contactRequest' : 'supportRequest',
        { name, email, message, subject }
    );
    return responseFormatter(res, 200, "Message sent successfully");
});
