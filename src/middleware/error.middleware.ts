import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.utils';
import { QueryFailedError } from 'typeorm';

export const errorMiddleware = (
  err: Error | AppError | QueryFailedError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Something went wrong';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof QueryFailedError) {
    statusCode = 400;
    message = 'Database query failed';

    // Handle duplicate key error
    if ((err as any).code === 'ER_DUP_ENTRY') {
      message = 'Duplicate entry. This record already exists.';
    }
  }

  console.error('Error:', err);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
