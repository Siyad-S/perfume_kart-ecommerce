
import app from '../src/app';
import connectToDB from '../src/config/connection';
import { Request, Response } from 'express';

export default async (req:Request, res:Response) => {
    await connectToDB();
    return app(req, res);
};
