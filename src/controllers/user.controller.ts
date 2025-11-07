import { Response } from 'express';
import { AuthRequest, RegisterDTO, LoginDTO } from '../types';
import { AppError } from '../utils/error.utils';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../entities/User.entity';
import { UserRepository } from '../repositories/user.repository';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { AppDataSource } from '@/data-source';

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userName, userEmail, password }: RegisterDTO = req.body;

  console.log('req.body', req.body)
  console.log('userName', userName)
  // console.log('email', email)
  console.log('password', password)

  if (!userName || !userEmail || !password) {
    throw new AppError('All fields are required', 400);
  }

  const userRepository = AppDataSource.getRepository(User);

  const existingUser = await userRepository.findOne({
    where: { userEmail },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists"
    });
  }

  const user = userRepository.create({
    userName,
    userEmail,
    password,
    avatarSecureUrl:
      'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
  });

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill',
      });

      if (result) {
        user.avatarPublicId = result.public_id;
        user.avatarSecureUrl = result.secure_url;
        await fs.rm(req.file.path);
      }
    } catch (error) {
      throw new AppError('File upload failed, please try again', 500);
    }
  }

  await userRepository.save(user);

  const token = user.generateJWTToken();

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: userWithoutPassword,
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password }: LoginDTO = req.body;

  if (!email || !password) {
    throw new AppError('All fields are required', 400);
  }

  const user = await UserRepository.findByEmail(email);

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Email or password do not match', 400);
  }

  const token = user.generateJWTToken();

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    user: userWithoutPassword,
  });
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.cookie('token', '', {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User details',
    user,
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userName } = req.body;
  const userId = req.user?.id;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (userName) {
    user.userName = userName;
  }

  if (req.file) {
    // Delete old avatar from cloudinary if exists
    if (user.avatarPublicId) {
      await cloudinary.v2.uploader.destroy(user.avatarPublicId);
    }

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill',
      });

      if (result) {
        user.avatarPublicId = result.public_id;
        user.avatarSecureUrl = result.secure_url;
        await fs.rm(req.file.path);
      }
    } catch (error) {
      throw new AppError('File upload failed, please try again', 500);
    }
  }

  await userRepository.save(user);

  res.status(200).json({
    success: true,
    message: 'User profile updated successfully',
    user,
  });
});
