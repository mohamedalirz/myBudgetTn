const express = require('express');
const router = express.Router();
const { loginUser, signupUser } = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);

module.exports = router;
