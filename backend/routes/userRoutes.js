const express = require('express');
const router = express.Router();
const { loginUser, signupUser } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/register', signupUser);
router.post('/forgot-password', forgotPassword);

module.exports = router;
