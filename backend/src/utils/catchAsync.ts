import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: (req: Request | any, res: Response | any, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
