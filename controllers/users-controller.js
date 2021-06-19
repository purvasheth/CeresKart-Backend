const bcrypt = require("bcryptjs");
const { User } = require("../models/users-model");
const { sendError } = require("../utils");

async function findUserByEmail(email) {
  const user = await User.findOne({ email });
  return user;
}

async function findUserById(id) {
  const user = await User.findById(id);
  return user;
}

async function saveNewUser({ password, email, lastName, firstName }) {
  if (!password) {
    throw new Error("password is required");
  }

  const newUser = new User({
    email,
    password,
    lastName,
    firstName,
  });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  const savedUser = await newUser.save();
  return savedUser;
}

async function updatePassword(user, password) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  return user.save();
}

module.exports = { findUserByEmail, saveNewUser, updatePassword, findUserById };
