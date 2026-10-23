const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const emailService = require('../services/emailService');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    if (!username || !password || !phoneNumber) {
      return res
        .status(400)
        .json({ error: 'username, password and phoneNumber are required' });
    }

    if (!email) {
      return res
        .status(400)
        .json({ error: 'email is required for account verification' });
    }

    if (!phoneNumber.startsWith('+')) {
      return res
        .status(400)
        .json({ error: 'phoneNumber must start with + and country code' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { phoneNumber }, { email }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'Username, email, or phone number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, username, verificationToken);

    return res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      email: email,
    });
  } catch (err) {
    console.error('Error in register:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ error: 'username or email and password are required' });
    }

    const user = await User.findOne(
      username ? { username } : { email }
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return res.status(200).json({ user: userSafe, token });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (err) {
    console.error('Error in verifyEmail:', err);
    return res.status(500).json({ error: 'Email verification failed' });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(email, user.username, verificationToken);

    return res.status(200).json({
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (err) {
    console.error('Error in resendVerification:', err);
    return res.status(500).json({ error: 'Failed to resend verification email' });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(email, user.username, resetToken);

    return res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    console.error('Error in requestPasswordReset:', err);
    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'New password is required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Send confirmation email
    await emailService.sendPasswordResetConfirmation(user.email, user.username);

    return res.status(200).json({
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    return res.status(500).json({ error: 'Password reset failed' });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
};
