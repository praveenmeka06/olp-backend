const Course = require("../models/courseModel");

exports.getAll = async (req, res) => {
  try {
    const courses = await Course.find({ isDeleted: false });

    res.status(200).json({
      status: "success",
      data: courses,
      message: "courses retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id, isDeleted: false });

    res.status(200).json({
      status: "success",
      data: course,
      message: "course retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};

exports.postOne = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);

    res.status(201).json({
      status: "success",
      message: "course created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
      error: error,
    });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body);

    res.status(201).json({
      status: "success",
      message: "course updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};
