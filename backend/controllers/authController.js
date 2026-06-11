const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required credentials (name, email, password)" });
    }

    // Check if user exists
    const userExists = await db.users.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already registered under this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await db.users.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Citizen'
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, message: "Server error during registration process" });
  }
}

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter your email and password" });
    }

    // Check user email
    const user = await db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password credentials" });
    }

    return res.json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        income: user.income,
        state: user.state,
        education: user.education,
        occupation: user.occupation
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
}

/**
 * @desc    Get user profile data
 * @route   GET /api/auth/profile
 */
async function getProfile(req, res) {
  try {
    const user = await db.users.findById(req.user.id);
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        income: user.income,
        state: user.state,
        education: user.education,
        occupation: user.occupation
      }
    });
  } catch (err) {
    console.error("Profile Error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching user profile" });
  }
}

/**
 * @desc    Update user profile demographics
 * @route   PUT /api/auth/profile
 */
async function updateProfile(req, res) {
  try {
    const { age, gender, income, state, education, occupation } = req.body;

    const updatedUser = await db.users.update(req.user.id, {
      age: age !== undefined ? parseInt(age) : req.user.age,
      gender: gender !== undefined ? gender : req.user.gender,
      income: income !== undefined ? parseInt(income) : req.user.income,
      state: state !== undefined ? state : req.user.state,
      education: education !== undefined ? education : req.user.education,
      occupation: occupation !== undefined ? occupation : req.user.occupation
    });

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        age: updatedUser.age,
        gender: updatedUser.gender,
        income: updatedUser.income,
        state: updatedUser.state,
        education: updatedUser.education,
        occupation: updatedUser.occupation
      }
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ success: false, message: "Server error updating user profile" });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
