import { Request, Response } from 'express';
import { sendEmail } from '../services/mailer.service';
import { responseFormatter } from '@/utils/responseFormatter';

export const contactSupport = async (req: Request, res: Response) => {
    try {
        const { name, email, message, subject } = req.body;

        if (!name || !email || !message) {
            return responseFormatter(res, 400, "Please provide name, email, and message");
        }

        const supportEmail = process.env.SUPPORT_MAIL;

        if (!supportEmail) {
            return responseFormatter(res, 400, "Support email configuration missing");
        }

        await sendEmail(
            supportEmail,
            subject ? `Contact Us Request from ${name}` : `Support Request from ${name}`,
            subject ? 'contactRequest' : 'supportRequest',
            { name, email, message, subject }
        );
        return responseFormatter(res, 200, "Message sent successfully");
    } catch (error) {
        return responseFormatter(res, 500, "Failed to send message");
    }
};
