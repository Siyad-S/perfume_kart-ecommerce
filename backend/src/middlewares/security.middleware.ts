import rateLimit from 'express-rate-limit';

// Create limiter instances outside of request handlers
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Too many login attempts from this IP, please try again after an hour',
    },
});

export const globalLimiter = (req: any, res: any, next: any) => {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }
    return generalLimiter(req, res, next);
};

export const authLimiter = (req: any, res: any, next: any) => {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }
    return loginLimiter(req, res, next);
};
