import express from 'express'
const router = express.Router()

import courseController from "../../controllers/instructor-controller/course-controller.js";

const { addNewCourse, getAllCourses, getCourseDetailsByID, updateCourseByID } = courseController ;

console.log({getAllCourses});
console.log({getCourseDetailsByID});

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

export default router;
