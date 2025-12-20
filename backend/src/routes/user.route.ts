// routes/authRoutes.js
import { RequestHandler, Router } from 'express';
import { register, login, refreshToken, deleteUser, logout, list, update, getUserProfile, getCart, getAddresses } from '../controllers/user.controller';
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
router.get('/me', getUserProfile)

router.get("/cart/:id", getCart)

// get user addresses
router.get("/addresses/:id", getAddresses)


export default router