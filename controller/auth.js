const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};
const isValidMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

const generateUserToken = (email) => {
  const token =  jwt.sign({ userId: email }, process.env.JWT_SECRET);
  return token;
};


const registerUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const isExistingUserEmail = await User.findOne({ email: email });
    if (isExistingUserEmail) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
    const isExistingUserMobile = await User.findOne({ mobile: mobile });
    if (isExistingUserMobile) {
      return res
        .status(409)
        .json({ message: "User with this mobile number already exists" });
    }

    if (!isValidMobileNumber(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number format",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email Id",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    const userResponse = await userData.save();
    const userToken = generateUserToken(userResponse.email);
    res.status(201).json({
      message: "User registered successfully",
      token: userToken,
      name: name,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { userIdentifier, password } = req.body;

    if (!userIdentifier || !password) {
      return res.status(400).json({
        message: "Bad Request! Invalid credentials",
      });
    }

    let userDetails;
    if (userIdentifier.indexOf("@") > -1) {
      userDetails = await User.findOne({ email: userIdentifier });
    } else {
      userDetails = await User.findOne({ mobile: userIdentifier });
    }

    if (!userDetails) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = generateUserToken(userDetails.email);
    res.status(201).json({
      message: "User logged in successfully",
      token: token,
      name: userDetails.name,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerUser, loginUser };
