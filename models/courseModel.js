const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [20, "Description must be at least 20 characters long"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
