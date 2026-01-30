import { Router } from 'express';
import passport from 'passport';
import { googleCallback } from '../controllers/auth.controller';

const router = Router();

//Google redirect
router.get(
    '/google',
    (req, res, next) => {
        const state = req.query.role === 'admin' ? 'role=admin' : undefined;
        passport.authenticate('google', {
            session: false,
            scope: ['profile', 'email'],
            prompt: 'select_account',
            state: state,
        })(req, res, next);
    }
);

//Google callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login-fail' }),
    googleCallback
);

export default router;
