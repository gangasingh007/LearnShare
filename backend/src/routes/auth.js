const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authcontroller = require('../controllers/authcontroller')


router.post('/register', authcontroller.register);
router.post('/login',authcontroller.login);
router.get('/profile', auth, authcontroller.getProfile);
router.put('/profile', auth, authcontroller.updateProfile)

module.exports = router;
