import { NextFunction, Request, RequestHandler, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import User from '../services/user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AddressType, LoginRegisterType, LoginType, UserType } from '../types/user.types';
import { responseFormatter } from '../utils/responseFormatter';
import { ListRequestType } from '../types/common.types';
import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import { sendEmail } from '../services/mailer.service';

import { generateTokens } from '../utils/token.utils';

// Register
export const register = catchAsync(async (
  req: Request<{}, {}, LoginRegisterType>,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findByQuery({ email });
  if (existingUser) {
    return next(new AppError('User already exists', 400));
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.createUser({
    name,
    email,
    role: "user",
    password: hashedPassword,
  });

  const payload = { _id: user._id, email: user.email, role: user.role };
  const { accessToken, refreshToken } = generateTokens(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return responseFormatter(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }, "Registration successful", 200);
});

// Login
export const login = catchAsync(async (
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, portal } = req.body;
  const user = await User.findByQuery({ email });
  if (!user) {
    return next(new AppError('User does not exist', 400));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 400));
  } else {
    if (portal === 'admin' && user.role !== 'admin') {
      return next(new AppError('Unauthorized access to admin portal', 403));
    }
    const payload = { _id: user._id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    const isForAdmin = portal === 'admin';
    const accessTokenCookieName = isForAdmin ? "adminAccessToken" : "accessToken";
    const refreshTokenCookieName = isForAdmin ? "adminRefreshToken" : "refreshToken";

    res.cookie(accessTokenCookieName, accessToken, {
      httpOnly: true,
      sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return responseFormatter(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, "Login successful", 200);
  }
});

// List Users
export const list = catchAsync(async (
  req: Request<{}, {}, Partial<ListRequestType>>,
  res: Response,
  next: NextFunction,
) => {
  const { search, skip, limit, sort, filter = {} } = req.body;
  (filter as { is_deleted: boolean }).is_deleted = false;
  let listSort: object = { createdAt: -1 };
  if (sort) {
    switch (sort) {
      case 'name':
        listSort = { firstName: 1 };
        break;
      case 'name_desc':
        listSort = { firstName: -1 };
        break;
      case 'createdAt_asc':
        listSort = { createdAt: 1 };
        break;
      case 'createdAt_desc':
        listSort = { createdAt: -1 };
        break;
      default:
        listSort = { createdAt: -1 };
        break;
    }
  }
  (filter as { sort: object }).sort = listSort;
  if (search) {
    (filter as { search: string }).search = search;
  }
  // const includes = []
  // const projectArray = []
  const list = await User.list(skip || 0, limit || 10000, filter);
  return responseFormatter(res, list, 'User list', 200);
});

// Update user
export const update = catchAsync(async (
  req: Request<{ id: string }, any, Partial<UserType>>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    addresses,
    // role_id,
    role,
    languagePreferences,
    cart,
    viewedProducts,
    favourites,
    wishlist,
    phone,
    updatedAt,
    newPassword,
    confirmPassword
  } = req.body;

  const existingUser = await User.findByQuery({ _id: new mongoose.Types.ObjectId(id) })

  if (!existingUser) {
    return next(new AppError('User not found', 404));
  }

  const updateData: Partial<UserType> = {
    name,
    email,
    password,
    role,
  };

  if (addresses && Array.isArray(addresses)) {
    const existingAddresses = existingUser.addresses || [];
    const updatedAddresses: any[] = [...existingAddresses];

    for (const address of addresses) {
      if (address._id) {
        const existingAddress = existingAddresses.find(
          (a: any) => a._id.toString() === (address._id || "").toString()
        );

        if (existingAddress) {
          Object.assign(existingAddress, address);
        } else {
          updatedAddresses.push(address);
        }
      } else {
        updatedAddresses.push({
          ...address,
        });
      }
    }

    updateData.addresses = updatedAddresses;
  }

  // if (role_id) {
  //   updateData.role_id = role_id;
  // }

  if (languagePreferences) {
    updateData.languagePreferences = languagePreferences;
  }

  if (cart) {
    updateData.cart = cart;
  }

  if (viewedProducts) {
    updateData.viewedProducts = viewedProducts;
  }

  if (favourites) {
    updateData.favourites = favourites;
  }

  if (wishlist) {
    updateData.wishlist = wishlist;
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updateData.password = hashedPassword;
  }

  if (phone) {
    updateData.phone = phone;
  }

  if (updatedAt) {
    updateData.updatedAt = updatedAt;
  }

  if (password && newPassword && confirmPassword) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid current password', 400));
    }
    if (newPassword !== confirmPassword) {
      return next(new AppError('New password and confirm password do not match', 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    updateData.password = hashedPassword;
  }

  const user = await User.update(new mongoose.Types.ObjectId(id), updateData);
  return responseFormatter(res, user, 'User updated', 200);
});

// Delete user
export const deleteUser = catchAsync(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("User id is required", 400));
  }
  const userId = new mongoose.Types.ObjectId(id)
  const isExists = await User.findByQuery({ _id: userId });
  if (!isExists) {
    return next(new AppError('User does not exist', 400));
  }
  const user = await User.update(userId, { is_deleted: true });
  return responseFormatter(res, user, 'User deleted', 200);
});

// Refresh
export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.refreshToken;
  if (!token) return next(new AppError("No refresh token", 401));

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as {
    _id: string; // Changed id to _id
    email: string;
    role: string;
  };

  const payload = { _id: decoded._id, email: decoded.email, role: decoded.role }; // Changed id to _id
  const { accessToken } = generateTokens(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  return responseFormatter(res, { ok: true }, "Access token refreshed", 200);
});

// Logout user
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("adminAccessToken", cookieOptions);
  res.clearCookie("adminRefreshToken", cookieOptions);
  return responseFormatter(res, null, 'Logout success', 200);
});

// Get user profile
export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Guest user", 401));
  }

  const userId = new mongoose.Types.ObjectId(req.user._id)
  const user = await UserModel.findById(userId).select("-password"); // Changed .id to ._id

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return responseFormatter(res, { user }, "User fetched successfully", 200);
});

//get user cart
export const getCart = catchAsync(async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const includes = ['cartProducts'];
  const userData = await User.list(0, 1, {
    _id: new mongoose.Types.ObjectId(id)
  }, includes)

  if (userData[0]?.data && userData[0]?.data.length > 0) {
    responseFormatter(res, userData[0]?.data[0].cart, 'User cart fetched success!', 200);
  } else {
    return next(new AppError('User cart not found', 404));
  }
});

//get user addresses
export const getAddresses = catchAsync(async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const includes = ['addresses'];
  const userData = await User.list(0, 1, {
    _id: new mongoose.Types.ObjectId(id)
  }, includes)

  if (userData[0]?.data && userData[0]?.data.length > 0) {
    responseFormatter(res, userData[0]?.data[0].addresses, 'User addresses fetched success!', 200);
  } else {
    return next(new AppError('User addresses not found', 404));
  }
});

//clear user cart
export const clearCart = catchAsync(async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const user = await User.update(new mongoose.Types.ObjectId(id), {
    cart: [],
  })
  return responseFormatter(res, user, 'User cart cleared', 200);
});

// Forgot Password
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, portal } = req.body;
  const user = await User.findByQuery({ email });
  if (!user) {
    return next(new AppError('User with this email does not exist', 404));
  }

  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expireTime = Date.now() + 3600000;

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(expireTime);
  await User.update(user._id, user);

  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetPath = portal === 'admin'
    ? `/admin/auth/reset-password/${token}`
    : `/reset-password/${token}`;

  const resetUrl = `${baseUrl}${resetPath}`;

  await sendEmail(user.email, 'Password Reset Request', 'resetPassword', { resetUrl });

  return responseFormatter(res, null, 'Password reset email sent', 200);
});

// Reset Password
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired', 400));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return responseFormatter(res, null, 'Password has been reset', 200);
});

//get wishlist products
export const getWishlist = catchAsync(async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const includes = ['wishlist'];
  const userData = await User.list(0, 1, {
    _id: new mongoose.Types.ObjectId(id)
  }, includes)

  if (userData[0]?.data && userData[0]?.data.length > 0) {
    responseFormatter(res, userData[0]?.data[0].wishlist, 'User wishlist fetched success!', 200);
  } else {
    return next(new AppError('User wishlist not found', 404));
  }
});

//update user wishlist
export const updateWishlist = catchAsync(async (
  req: Request<{ id: string }, {}, { productId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { productId } = req.body;

  if (!productId) {
    return next(new AppError('Product ID is required', 400));
  }

  const user = await UserModel.findById(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const productObjectId = new mongoose.Types.ObjectId(productId);
  const isInWishlist = user.wishlist.some((item) => item.product_id.toString() === productId);

  let updatedUser;
  if (isInWishlist) {
    // Remove from wishlist
    updatedUser = await User.update(
      new mongoose.Types.ObjectId(id),
      { $pull: { wishlist: { product_id: productObjectId } } }
    );
  } else {
    // Add to wishlist
    updatedUser = await User.update(
      new mongoose.Types.ObjectId(id),
      { $push: { wishlist: { product_id: productObjectId, quantity: 1 } } }
    );
  }

  if (!updatedUser) {
    return next(new AppError('Failed to update wishlist', 500));
  }

  return responseFormatter(res, updatedUser.wishlist, isInWishlist ? 'Removed from wishlist' : 'Added to wishlist', 200);
});