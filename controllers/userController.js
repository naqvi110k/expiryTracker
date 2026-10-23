const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      telegramUserId: user.telegramUserId,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      telegramUserId: user.telegramUserId,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ user: userSafe });
  } catch (err) {
    console.error('Error in getMe:', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const updateMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, phoneNumber, telegramUserId } = req.body;

    if (!username || !phoneNumber) {
      return res
        .status(400)
        .json({ error: 'username and phoneNumber are required' });
    }

    if (!phoneNumber.startsWith('+')) {
      return res
        .status(400)
        .json({ error: 'phoneNumber must start with + and country code' });
    }

    const duplicate = await User.findOne({
      _id: { $ne: userId },
      $or: [
        { username },
        ...(email ? [{ email }] : []),
        { phoneNumber },
      ],
    });

    if (duplicate) {
      return res
        .status(409)
        .json({ error: 'Username, email, or phone number already in use' });
    }

    // Prepare update object
    const updateData = {
      username,
      email: email || undefined,
      phoneNumber,
    };

    // Add telegramUserId to update if provided
    if (telegramUserId !== undefined) {
      updateData.telegramUserId = telegramUserId;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = generateToken(user);

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      telegramUserId: user.telegramUserId,
    };

    return res.status(200).json({ user: userSafe, token });
  } catch (err) {
    console.error('Error in updateMe:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

const deleteMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Product.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'Account and products deleted' });
  } catch (err) {
    console.error('Error in deleteMe:', err);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: 'currentPassword and newPassword are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in changePassword:', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
};

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  changePassword,
};


