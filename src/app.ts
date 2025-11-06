import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes
import userRoutes from './routes/user.routes';
// import courseRoutes from './routes/course.routes';
// import paymentRoutes from './routes/payment.routes';
// import miscellaneousRoutes from './routes/miscellaneous.routes';

// Import middleware
import { errorMiddleware } from './middleware/error.middleware';

const app: Application = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parser middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Cookie parser
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/courses', courseRoutes);
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1', miscellaneousRoutes);

// Test route
app.get('/api/v1/test', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is working!',
  });
});

// 404 handler - must be after all routes
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handling middleware - must be last
app.use(errorMiddleware);

export default app;
