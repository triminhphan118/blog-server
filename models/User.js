const mongoose = require("mongoose");

const schemaUser = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 60,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    avatar: {
      type: String,
    },
    decs: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    role: {
      type: Number,
      default: 2,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", schemaUser);
