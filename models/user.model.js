const mongoose = require('mongoose');
const generateHelper = require("../helpers/generate");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokenUser: {
      type: String,
      default: generateHelper.generateRandomString(30),
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10,15}$/, 'Please use a valid phone number'],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema, "users");
module.exports = User;
