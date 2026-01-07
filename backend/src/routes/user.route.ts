import { RequestHandler, Router } from 'express';
import { register, login, refreshToken, deleteUser, logout, list, update, getUserProfile, getCart, getAddresses, forgotPassword, resetPassword, getWishlist, updateWishlist } from '../controllers/user.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from '../validations/user.validation';
import { authLimiter } from '../middlewares/security.middleware';

const router = Router();
type DeleteParams = { id: string };
type UpdateParams = { id: string };

// Register user
router.post('/register', authLimiter, validate(registerSchema), register);
// Login user
router.post('/login', authLimiter, validate(loginSchema), login);
// Refresh token
router.get('/refresh', refreshToken);
// Logout user 
router.post('/logout', logout);
// Delete user
router.delete(
    "/delete/:id",
    deleteUser as RequestHandler<DeleteParams>
);
// Users list
router.get('/list', list);
// update user
router.patch(
    "/update/:id",
    validate(updateProfileSchema),
    update as RequestHandler<UpdateParams>
);

// Get user profile
router.get('/me', optionalAuthMiddleware, getUserProfile as RequestHandler)

// Get user cart
router.get("/cart/:id", getCart)

// Get user addresses
router.get("/addresses/:id", getAddresses)

//Get all user addresses
router.get("/addresses/:id", getAddresses)

// Forgot Password
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);

// Reset Password
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

//Get user wishlist
router.get("/wishlist/:id", getWishlist)

//Update user wishlist
router.patch("/wishlist/:id", updateWishlist)

export default router