import express from 'express'

import studentCourseController from "../../controllers/student-controller/course-controller.js";

const router = express.Router()

const { getStudentViewCourseDetails, getAllStudentViewCourses, checkCoursePurchaseInfo } = studentCourseController;



router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

export default router;
