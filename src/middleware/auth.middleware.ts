import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error.utils';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest, JwtPayload } from '../types';
import { User } from '../entities/User.entity';
import { AppDataSource } from '@/data-source';

export const isLoggedIn = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Unauthenticated, please login', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user;
    next();
  }
);

export const authorizedRoles = (...roles: string[]) => {
  return asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const currentRole = req.user?.role;

    if (!currentRole || !roles.includes(currentRole)) {
      throw new AppError('You do not have permission to access this route', 403);
    }

    next();
  });
};

export const authorizedSubscriber = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const subscriptionStatus = req.user?.subscriptionStatus;
    const currentRole = req.user?.role;

    if (currentRole !== 'ADMIN' && subscriptionStatus !== 'active') {
      throw new AppError('Please subscribe to access this route', 403);
    }

    next();
  }
);
