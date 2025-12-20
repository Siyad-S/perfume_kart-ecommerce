import { NextFunction, Request, RequestHandler, Response } from 'express';
import User from '../services/user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AddressType, LoginRegisterType, LoginType, UserType } from '../types/user.types';
import { responseFormatter } from '../utils/responseFormatter';
import { ListRequestType } from '@/types/common.types';
import mongoose from 'mongoose';
import UserModel from '../models/user.model';

interface User {
  id: string,
  email: string,
}

interface deleteParams {
  id: string
}

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// Helper: generate tokens
const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// Register
export const register = async (
  req: Request<{}, {}, LoginRegisterType>,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    const existingUser = await User.findByQuery({ email });
    if (existingUser) {
      return responseFormatter(res, null, 'User already exists', 400);
    }

    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.createUser({
      name,
      email,
      role: "user",
      password: hashedPassword,
    });

    const payload = { id: user._id, email: user.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    // inside register or login after generating tokens
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development", // only send over HTTPS in prod
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return responseFormatter(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    }, "Registration successful", 200);

  } catch (error) {
    console.error('Registration Error:', error);
    responseFormatter(res, null, 'Registration failed', 500);
  }
};

// Login
export const login = async (
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findByQuery({ email });
    if (!user) {
      return responseFormatter(res, null, 'User does not exist', 400);
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return responseFormatter(res, null, 'Invalid credentials', 400);
    } else {
      // Generate JWT
      const payload = { id: user._id, email: user.email };
      const { accessToken, refreshToken } = generateTokens(payload);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        sameSite: "none",
        secure: true,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Log tokens and cookies
      console.log("Access Token:", accessToken.substring(0, 20) + "...");
      console.log("Refresh Token:", refreshToken.substring(0, 20) + "...");
      console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);


      return responseFormatter(res, {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }, "Login successful", 200);
    }
  } catch (error) {
    console.error('Login Error:', error);
    responseFormatter(res, null, 'Login failed', 500);
  }
};

// List Users
export const list = async (
  req: Request<{}, {}, Partial<ListRequestType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, skip, limit, sort, filter = {} } = req.body;
    (filter as { is_deleted: boolean }).is_deleted = false;
    let listSort: object = { created_at: -1 };
    if (sort) {
      switch (sort) {
        case 'name':
          listSort = { firstName: 1 };
          break;
        case 'name_desc':
          listSort = { firstName: -1 };
          break;
        case 'created_at':
          listSort = { created_at: 1 };
          break;
        case 'created_at_desc':
          listSort = { created_at: -1 };
          break;
        default:
          listSort = { created_at: -1 };
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
  } catch (error) {
    console.error('User List Error:', error);
    responseFormatter(res, null, 'User list failed', 500);
  }
};

// Update user
export const update: RequestHandler<deleteParams, any, Partial<UserType>> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      addresses,
      // role_id,
      role = "user",
      languagePreferences,
      cart,
      viewedProducts,
      favourites,
      wishlist,
      phone,
      updated_at,
      newPassword,
      confirmPassword
    } = req.body;

    // Check if user exists
    const existingUser = await User.findByQuery({ _id: new mongoose.Types.ObjectId(id) })

    const updateData: Partial<UserType> = {
      name,
      email,
      password,
      role,
      updated_at: new Date(),
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

    if (updated_at) {
      updateData.updated_at = updated_at;
    }

    if (password && newPassword && confirmPassword) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return responseFormatter(res, null, 'Invalid current password', 400);
      }
      if (newPassword !== confirmPassword) {
        return responseFormatter(res, null, 'New password and confirm password do not match', 400);
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }

    const user = await User.update(new mongoose.Types.ObjectId(id), updateData);
    return responseFormatter(res, user, 'User updated', 200);
  } catch (error) {
    console.error('User Update Error:', error);
    responseFormatter(res, null, 'User update failed', 500);
  }
}

// Delete user
export const deleteUser: RequestHandler<deleteParams> = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseFormatter(res, null, "User id is required", 400);
    }
    const userId = new mongoose.Types.ObjectId(id)
    const isExists = await User.findByQuery({ _id: userId });
    if (!isExists) {
      return responseFormatter(res, null, 'User does not exist', 400);
    }
    const user = await User.update(userId, { is_deleted: true, updated_at: new Date() });
    return responseFormatter(res, user, 'User deleted', 200);
  } catch (error) {
    console.error('User Delete Error:', error);
    responseFormatter(res, null, 'User delete failed', 500);
  }
}

// Refresh
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return responseFormatter(res, null, "No refresh token", 401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
    const { accessToken } = generateTokens(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "production",
      // sameSite: "strict",
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    return responseFormatter(res, { ok: true }, "Access token refreshed", 200);
  } catch (error) {
    return responseFormatter(res, null, "Invalid refresh token", 403);
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return responseFormatter(res, null, 'Logout success', 200);
  } catch (error) {
    return responseFormatter(res, null, 'Logout failed', 500);
  }
}

// Get user profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return responseFormatter(res, null, "Unauthorized", 401);
    }

    // Fetch user from DB (to ensure latest data)
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return responseFormatter(res, null, "User not found", 404);
    }

    return responseFormatter(res, { user }, "User fetched successfully", 200);
  } catch (error) {
    return responseFormatter(res, null, "Error fetching user", 500);
  }
};

export const getCart = async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response
) => {
  try {
    const { id } = req.params
    const includes = ['cartProducts'];
    const userData = await User.list(0, 1, {
      _id: new mongoose.Types.ObjectId(id)
    }, includes)

    if (userData[0]?.data) {
      responseFormatter(res, userData[0]?.data[0].cart, 'User cart fetched success!', 200);
    } else {
      return responseFormatter(res, null, 'User cart not found', 404);
    }

  } catch (error) {
    console.error('User cart fetching Error:', error);
    responseFormatter(res, null, 'User cart fetching failed', 500);
  }
}

export const getAddresses = async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response
) => {
  try {
    const { id } = req.params
    const includes = ['addresses'];
    const userData = await User.list(0, 1, {
      _id: new mongoose.Types.ObjectId(id)
    }, includes)

    if (userData[0]?.data) {
      responseFormatter(res, userData[0]?.data[0].addresses, 'User addresses fetched success!', 200);
    } else {
      return responseFormatter(res, null, 'User addresses not found', 404);
    }

  } catch (error) {
    console.error('User addresses fetching Error:', error);
    responseFormatter(res, null, 'User addresses fetching failed', 500);
  }
}

export const clearCart = async (
  req: Request<{ id: string }, {}, Partial<UserType>>,
  res: Response
) => {
  try {
    const { id } = req.params
    const user = await User.update(new mongoose.Types.ObjectId(id), {
      cart: [],
      updated_at: new Date()
    })
    return responseFormatter(res, user, 'User cart cleared', 200);
  } catch (error) {
    console.error('User cart clearing Error:', error);
    responseFormatter(res, null, 'User cart clearing failed', 500);
  }
}