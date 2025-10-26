import express from 'express'
import studentCoursesController from "../../controllers/student-controller/student-courses-controller.js";

const router = express.Router()

const {getCoursesByStudentId }  = studentCoursesController; 

router.get("/get/:studentId", getCoursesByStudentId);

export default router;
