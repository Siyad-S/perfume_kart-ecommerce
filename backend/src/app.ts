import express from 'express';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler.middleware';
import dotenv from 'dotenv';
import connectToDB from './config/connection';
import cors from 'cors';
import routes from './routes'
import { authMiddleware, adminAuthMiddleware } from './middlewares/auth.middleware';
import cookieParser from 'cookie-parser';
import passport from 'passport';

dotenv.config();
connectToDB();
const app = express();
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());
import './config/passport';

//user routes
app.use("/", routes);
//admin routes
app.use("/admin", adminAuthMiddleware, routes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
