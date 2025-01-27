const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const sendJwtToken = (user, statusCode, res) => {
  var token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(statusCode).json({
    status: "success",
    token,
    role: user.role,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    sendJwtToken(newUser, 201, res);
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Already email is registered",
      });
    }
    res.status(400).json({
      status: "fail",
      message: "Use valid email and password",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ status: "fail", message: "enter email and password" });

    const existingUser = await User.findOne({
      email: email,
      isDeleted: false,
    }).select("+password");

    if (!existingUser)
      return res
        .status(404)
        .json({ status: "fail", message: "email or password is incorrect" });

    let validPassword = await existingUser.comparePassword(
      password,
      existingUser.password
    );

    if (!validPassword)
      return res
        .status(404)
        .json({ status: "fail", message: "email or password is incorrect" });

    sendJwtToken(existingUser, 201, res);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal error",
    });
  }
};

exports.getMe = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res
        .status(401)
        .json({ status: "fail", message: "user is not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const validUser = await User.findById(decoded.id);

    if (!validUser)
      return res
        .status(401)
        .json({ status: "fail", message: "not valid user" });

    res
      .status(200)
      .json({
        status: "success",
        message: "current user is found",
        data: validUser,
      });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res
        .status(401)
        .json({ status: "fail", message: "user is not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const validUser = await User.findById(decoded.id);

    if (!validUser)
      return res
        .status(401)
        .json({ status: "fail", message: "not valid user" });

    req.user = validUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error,
    });
  }
};

exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role))
        return res
          .status(404)
          .json({ status: "fail", message: "user has no access" });

      next();
    } catch (error) {
      res.status(404).json({
        status: "fail",
        message: error,
      });
    }
  };
};
