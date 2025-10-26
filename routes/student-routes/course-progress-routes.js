import express from 'express';
const router = express.Router();
import courseProgressController from '../../controllers/student-controller/course-progress-controller.js';

const { getCurrentCourseProgress, markCurrentLectureAsViewed, resetCurrentCourseProgress } =
  courseProgressController ;

router.get('/get/:userId/:courseId', getCurrentCourseProgress);
router.post('/mark-lecture-viewed', markCurrentLectureAsViewed);
router.post('/reset-progress', resetCurrentCourseProgress);

export default router;
