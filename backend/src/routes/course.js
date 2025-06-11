const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const courseController =require('../controllers/courseController')

// POST /api/courses/ — create course (only contributors or admins)
router.post('/addcourse', auth, courseController.addcourse );
router.get('/displayall', courseController.getAllCourses);
router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);


module.exports = router;
