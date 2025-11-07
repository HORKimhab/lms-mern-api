import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from '../controllers/user.controller';
import { isLoggedIn } from '../middleware/auth.middleware';
import upload from '../middleware/multer.middleware';

const router = Router();

router.post('/auth/register', upload.single('avatar'), register);
router.post('/auth/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);
router.put('/update', isLoggedIn, upload.single('avatar'), updateProfile);

export default router;
