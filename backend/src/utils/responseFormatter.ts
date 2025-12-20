import { Response } from "express";

export const responseFormatter = (
    res: Response,
    data: any = null,
    message: string = "OK",
    statusCode: number = 200,
) => {
    res.status(statusCode).json({
        message,
        data,
    });
}