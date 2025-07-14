const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, username, password: hashed });
  await user.save();
  res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with that email does not exist' });
    }

    // Generate reset token (random string)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Save token and expiration to user model (you need to add these fields to your User schema)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL (frontend should handle this route)
    const resetUrl = `http://your-frontend-url/reset-password/${resetToken}`;

    // Send email
    const message = `You requested a password reset. Please click this link to reset your password:\n\n${resetUrl}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
