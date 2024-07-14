const User = require("../models/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create(req.body);
    //console.log("req", req.body);
    //const token = signToken(newUser._id);
    createSendToken(newUser, 201, req, res);
  };
  
  exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) check email n pwd exist
    if (!email || !password) {
      return next(new AppError("Please provide email or password !!!", 400));
    }
    //console.log(req.body.password);
  
    // 2) check if user exists and pwd is correct
    const user = await User.findOne({ email }).select("+password");
    const correct = await user.correctPassword(password, user.password);
    //console.log("user", user);
    //console.log("pwd", user.password);
  
    if (!user || !correct) {
      return next(new AppError("Incorrect email and password!!!", 401));
    }
  
    // 3) if everything oky, send token to client
    createSendToken(user, 200, req, res);
    //const token = signToken(user._id);
    // res.status(200).json({
    //   status: "success",
    //   //token,
    // });
  };