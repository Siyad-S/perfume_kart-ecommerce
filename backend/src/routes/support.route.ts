import express from 'express';
import { contactSupport } from '../controllers/support.controller';
import { validate } from '../middlewares/validate.middleware';
import { contactSupportSchema } from '../validations/support.validation';

const app = express.Router();

app.post('/contact', validate(contactSupportSchema), contactSupport);

export default app;
