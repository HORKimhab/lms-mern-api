import { Request } from 'express';
import { User } from '../entities/User.entity';

export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface RegisterDTO {
  userName: string;
  userEmail: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  category: string;
  createdBy: string;
}

export interface CreateLectureDTO {
  title: string;
  description: string;
  courseId: string;
}
