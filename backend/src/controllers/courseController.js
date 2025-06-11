
const Course = require('../models/course');
const courseController={
    addcourse:async (req, res) => {
        console.log("req.user:", req.user);
        const { userId, role } = req.user;
      
        if (role !== 'contributor' && role !== 'admin') {
          return res.status(403).json({ message: 'Only contributors or admins can create courses' });
        }
      
        const { title, description, category, link, price, imageUrl } = req.body; // Added price and imageUrl
      
        if (!title || !link) {
          return res.status(400).json({ message: 'Title and Link are required' });
        }
      
        try {
          const course = new Course({
            title,
            description,
            category,
            link,
            price, // Added price
            imageUrl, // Added imageUrl
            createdBy: userId,
          });
      
          await course.save();
      
          res.status(201).json({
            message: 'Course created successfully',
            course,
          });
        } catch (error) {
          console.error('Error creating course:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      getAllCourses: async (req, res) => {
        try {
          // Optional: Query params for filtering/searching
          const { category, search } = req.query;
    
          let filter = {};
    
          if (category) {
            filter.category = category;
          }
    
          if (search) {
            filter.title = { $regex: search, $options: 'i' }; // case-insensitive search
          }
    
          const courses = await Course.find(filter)
            .populate('createdBy', 'name role') // Only show contributor's name and role
            .sort({ createdAt: -1 }); // Most recent first
    
          res.status(200).json({ courses });
        } catch (error) {
          console.error('Error fetching courses:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      updateCourse: async (req, res) => {
        const courseId = req.params.id;
        const { userId, role } = req.user;
      
        // Destructure all expected fields from req.body, including price and imageUrl
        const { title, description, category, link, price, imageUrl } = req.body; 
      
        try {
          const course = await Course.findById(courseId);
      
          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }
      
          // Only owner or admin can update
          if (course.createdBy.toString() !== userId && role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update this course' });
          }
      
          // Update the fields if they exist in req.body
          if (title) course.title = title;
          if (description) course.description = description;
          if (category) course.category = category;
          if (link) course.link = link;
          // Check if price is provided and update it
          if (price !== undefined) course.price = price; 
          // Check if imageUrl is provided and update it
          if (imageUrl) course.imageUrl = imageUrl; 
      
          await course.save();
      
          res.status(200).json({ message: 'Course updated successfully', course });
        } catch (error) {
          console.error('Error updating course:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      deleteCourse: async (req, res) => {
        const courseId = req.params.id;
        const { userId, role } = req.user;
      
        try {
          const course = await Course.findById(courseId);
      
          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }
      
          // Only the creator or an admin can delete the course
          if (course.createdBy.toString() !== userId && role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this course' });
          }
      
          await course.deleteOne();
      
          res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
          console.error('Error deleting course:', error);
          res.status(500).json({ message: 'Server error' });
        }
      }
      
      
}
module.exports = courseController