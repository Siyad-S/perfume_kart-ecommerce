import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import dotenv from 'dotenv';
import connectToDB from './config/connection';
import cors from 'cors';
import routes from './routes'
import { authMiddleware } from './middlewares/auth.middleware';
import cookieParser from 'cookie-parser';

dotenv.config();
connectToDB();
const app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//user routes
app.use("/", routes);
//admin routes
app.use("/admin", authMiddleware, routes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
