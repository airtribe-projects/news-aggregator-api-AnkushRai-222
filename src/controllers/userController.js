const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || typeof JWT_SECRET !== 'string' || JWT_SECRET.trim() === '') {
  throw new Error('Missing required environment variable JWT_SECRET');
}

exports.signup = async ( { name, email, password, preferences }) => {
    try {
        const exists = await User.findOne({ email });
        if (exists) {
            const err = new Error('Email already in use');
            err.status = 400;
            throw err;
        }

        const user = new User({ name, email, password, preferences });
        await user.save();
        return user;
    } catch (err) {
        throw err;
    }
};

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (err) {
    throw err;
  }
};


exports.getPreferences = async (user) => {
  try {
    if (!user || typeof user !== 'object' || Array.isArray(user)) {
      const err = new Error("User not found or invalid");
      err.status = 401;
      throw err;
    }
    return user.preferences;
  } catch (err) {
    throw err;
  }
};

exports.updatePreferences = async (user, prefs) => {
  try {
    if (!Array.isArray(prefs)) {
      const err = new Error("preferences must be an array");
      err.status = 400;
      throw err;
    }
    user.preferences = prefs;
    await user.save();
    return user.preferences;
  } catch (err) {
    throw err;
  }
};

