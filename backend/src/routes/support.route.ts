import express from 'express';
import { contactSupport } from '../controllers/support.controller';

const app = express.Router();

app.post('/contact', contactSupport);

export default app;
