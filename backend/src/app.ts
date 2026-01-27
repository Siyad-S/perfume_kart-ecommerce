import express from 'express';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler.middleware';
import dotenv from 'dotenv';

import cors from 'cors';
import routes from './routes'
import { adminAuthMiddleware } from './middlewares/auth.middleware';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport';
import helmet from 'helmet';
import { globalLimiter } from './middlewares/security.middleware';
import config from './config/config';

const app = express();

const corsOptions = {
    origin: config.clientUrl.replace(/\/$/, ""),
    credentials: true,
}
app.use(cors(corsOptions));

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(helmet());
// app.use(globalLimiter);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());

//user routes
app.use("/", routes);
//admin routes
app.use("/admin", adminAuthMiddleware, routes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
