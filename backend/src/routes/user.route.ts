// routes/authRoutes.js
import { RequestHandler, Router } from 'express';
import { register, login, refreshToken, deleteUser, logout, list, update, getUserProfile, getCart, getAddresses, forgotPassword, resetPassword } from '../controllers/user.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
const router = Router();
type DeleteParams = { id: string };
type UpdateParams = { id: string };
// Register user
router.post('/register', register);
// Login user
router.post('/login', login);
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
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password/:token', resetPassword);

export default router