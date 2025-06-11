const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authcontroller = {
    register: async (req, res) => {
        const { name, email, password, role } = req.body;
      
        try {
          const existingUser = await User.findOne({ email });
      
          if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'viewer',
          });
      
          await user.save();
      
          res.status(201).json({ message: 'User registered successfully' });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      login:async (req, res) => {
        const { email, password } = req.body;
      
        try {
          // 1. Check if user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
          }
      
          // 2. Compare entered password with hashed password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
          }
      
          // 3. Create a JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
      
          // 4. Send token and user info back
          res.status(200).json({
            message: 'Login successful',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              subscribed: user.subscribed,
            },
          });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      updateProfile: async (req, res) => {
        const { userId } = req.user;
        const { name, email } = req.body;
    
        try {
          const user = await User.findById(userId);
    
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
    
          if (name) user.name = name;
          if (email) user.email = email;
    
          await user.save();
    
          res.status(200).json({
            message: 'Profile updated successfully',
            user: {
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        } catch (error) {
          console.error('Error updating profile:', error);
          res.status(500).json({ message: 'Server error' });
        }
      },
      getProfile: async (req, res) => {
        const { userId } = req.user;
    
        try {
          const user = await User.findById(userId).select('-password');
    
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
    
          res.status(200).json({ user });
        } catch (error) {
          console.error('Error fetching profile:', error);
          res.status(500).json({ message: 'Server error' });
        }
      }
}
module.exports = authcontroller;