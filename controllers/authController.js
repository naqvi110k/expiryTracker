const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

    if (!phoneNumber.startsWith('+')) {
      return res
        .status(400)
        .json({ error: 'phoneNumber must start with + and country code' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { phoneNumber }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'Username or phone number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email || undefined,
      password: hashedPassword,
      phoneNumber,
    });

    const token = generateToken(user);

    const userSafe = {
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return res.status(201).json({ user: userSafe, token });
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

module.exports = {
  register,
  login,
};


