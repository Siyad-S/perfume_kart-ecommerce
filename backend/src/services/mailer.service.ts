import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

let transporter: nodemailer.Transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    return transporter;
};

export const sendEmail = async (to: string, subject: string, templateName: string, data: any) => {
    try {
        const transport = await getTransporter();

        const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
        const logoUrl = process.env.LOGO_URL || `http://localhost:${process.env.PORT || 4000}/icons/fragrance_kart_ecommerce_logo.png`;

        const html = await ejs.renderFile(templatePath, { ...data, logoUrl }) as string;
        const info = await transport.sendMail({
            from: `"Fragrance Kart" <${process.env.SUPPORT_MAIL}>`,
            to,
            subject,
            text: `Please view this email in an HTML compatible email client.\n\n${data.resetUrl ? 'Link: ' + data.resetUrl : ''}`,
            html,
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
