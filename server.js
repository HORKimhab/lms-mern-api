import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import authRoutes from './routes/auth-routes/index.js';
import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js';
import studentViewCourseRoutes from './routes/student-routes/course-routes.js';
import studentViewOrderRoutes from './routes/student-routes/order-routes.js';
import studentCoursesRoutes from './routes/student-routes/student-courses-routes.js';
import studentCourseProgressRoutes from './routes/student-routes/course-progress-routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PORT = process.env.DB_PORT || 3306;
const MONGO_URI = process.env.MONGO_URI;
const DB_TYPE = process.env.DB_TYPE?.toLowerCase();
const isDev = process.env.APP_ENVIRONMENT === 'dev';

let db;

// DB_TYPE=mysql
// DB_HOST=localhost
// DB_PORT=3306
// DB_USERNAME=root
// DB_NAME=lms_mern
// DB_PASSWORD=

if (DB_TYPE === 'mysql') {
  db = new DataSource({
    type: DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [],
    synchronize: isDev, // Auto create tables (dev only)
    logging: process.env.DB_LOG === 'true',
  });

  db.initialize()
    .then(() => {
      console.log('✅ Connected to MySQL using TypeORM');
      // startServer();
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
      // startServer();
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
