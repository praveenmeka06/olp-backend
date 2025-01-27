const User = require("../models/userModel");

exports.getAll = async (req, res) => {
  try {
    const students = await User.find({ isDeleted: false, role: "student" });

    res.status(200).json({
      status: "success",
      data: students,
      message: "students retrieved successfully",
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
    const student = await User.findOne({
      _id: id,
      isDeleted: false,
      role: "student",
    });

    res.status(200).json({
      status: "success",
      data: student,
      message: "student retrieved successfully",
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
    const newValue = { ...req.body, password: "Asd@1234" };
    const newStudent = await User.create(newValue);

    res.status(201).json({
      status: "success",
      message: "student created successfully",
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
    const updatedStudent = await User.findByIdAndUpdate(id, req.body);

    res.status(201).json({
      status: "success",
      message: "student updated successfully",
    });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Already email is registered",
      });
    }
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await User.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};
