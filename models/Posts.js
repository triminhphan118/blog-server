const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 6,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    decs: {
      type: String,
    },
    content: {
      type: String,
      minLength: 10,
      required: true,
    },
    hot: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", schema);
