import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
// import { initializeDatabase } from './config/database.config';
import cloudinary from 'cloudinary';
import { initializeDatabase } from './data-source';
// import { initializeDatabase } from './config/database.config';
// import Razorpay from 'razorpay';

// Load environment variables
dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Razorpay (if using)
// export const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID as string,
//   key_secret: process.env.RAZORPAY_SECRET as string,
// });

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connected successfully');

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: ${process.env.DB_NAME || 'lms_db'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();
