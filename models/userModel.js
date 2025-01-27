const mongoose = require("mongoose");
const validatorLib = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
    trim: true,
    validate: {
      validator: (val) => validatorLib.isAlpha(val, ["en-US"], { ignore: " " }),
      message: "A user name must only  contain characters",
    },
  },
  email: {
    type: String,
    required: [true, "user must have a email"],
    unique: true,
    lowercase: true,
    validate: [validatorLib.isEmail, "not a valid email address"],
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minLength: 8,
    validate: [
      validatorLib.isStrongPassword,
      "Password must contain at least 8 characters and should conain atleast one lowercase, uppercase and special characters",
    ],
    select: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
});

//when user signup or update password hash the password and save to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

//populate course details
userSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "courses",
    match: { isDeleted: { $ne: true } },
    select: "_id title price",
  });

  next();
});

userSchema.methods.comparePassword = async function (
  password,
  existingPassword
) {
  return await bcrypt.compare(password, existingPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
