const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      phoneNumber,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Google OAuth login
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    // Verify Google token and get user information
    // Assume `verifyGoogleToken` is a function that verifies the token
    const googleUser = await verifyGoogleToken(token);
    let user = await User.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = await User.create({
        email: googleUser.email,
        phoneNumber: googleUser.phoneNumber,
        password: '', // Password not required for Google login
      });
    }
    const jwtToken = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Google login successful', token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: 'Google login failed' });
  }
};

// Helper function to verify Google token (pseudo-code)
async function verifyGoogleToken(token) {
  // Implement Google token verification logic
  return { email: 'user@example.com', phoneNumber: '1234567890' };
}
