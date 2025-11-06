import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import User from './entities/User.js';

dotenv.config();

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lms_mern',
  synchronize: false, // ❗ false when using migrations
  logging: process.env.DB_LOG === 'true',
  entities: [User],
  migrations: ['src/migrations/*.js'],
});

export default AppDataSource;
