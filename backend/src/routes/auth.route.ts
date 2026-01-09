import { Router } from 'express';
import passport from 'passport';
import { googleCallback } from '../controllers/auth.controller';

const router = Router();

//Google redirect
router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
        prompt: 'select_account',
    })
);

//Google callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login-fail' }),
    googleCallback
);

export default router;
