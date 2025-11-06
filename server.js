import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import 'reflect-metadata';
import authRoutes from './routes/auth-routes/index.js';
import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js';
import studentViewCourseRoutes from './routes/student-routes/course-routes.js';
import studentViewOrderRoutes from './routes/student-routes/order-routes.js';
import studentCoursesRoutes from './routes/student-routes/student-courses-routes.js';
import studentCourseProgressRoutes from './routes/student-routes/course-progress-routes.js';
import AppDataSource from './src/data-source.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DB_TYPE = process.env.DB_TYPE?.toLowerCase();

if (DB_TYPE === 'mysql') {
  AppDataSource.initialize()
    .then(() => {
      console.log('✅ Connected to MySQL using TypeORM');
    })
    .catch((err) => {
      console.trace('Trace connection failed', err);
      console.error('❌ MySQL connection failed:', err);
    });
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((e) => console.error('❌ MongoDB connection failed:', e));
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes);
app.use('/student/course', studentViewCourseRoutes);
app.use('/student/order', studentViewOrderRoutes);
app.use('/student/courses-bought', studentCoursesRoutes);
app.use('/student/course-progress', studentCourseProgressRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
