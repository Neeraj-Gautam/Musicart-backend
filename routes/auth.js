const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }

    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const isExistingUserMobile = await User.findOne({ mobile: mobile });
    if (isExistingUserMobile) {
      return res
        .status(409)
        .json({ message: "User with this mobile number already exists" });
    }
    
    // write a check for mobile number also

    /* const mobileRegex = /^[6-9]\d{9}$/; // Matches Indian mobile numbers starting with 6, 7, 8, or 9 and total of 10 digits
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({
                errorMessage: "Invalid mobile number format",
            });
        }
        */

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    const userResponse = await userData.save();

    const token = await jwt.sign(
      { userId: userResponse.email },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User registered successfully",
      token: token,
      name: name,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userIdentifier, password } = req.body;
    console.log(req.body);
    if (!userIdentifier || !password) {
      return res.status(400).json({
        errorMessage: "Bad Request! Invalid credentials",
      });
    }

    let userDetails;
    if (userIdentifier.indexOf("@") > -1) {
      userDetails = await User.findOne({ email: userIdentifier });
    } else {
      userDetails = await User.findOne({ mobile: userIdentifier });
    }

    if (!userDetails) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid credentials", success: false });
    }

    const token = await jwt.sign(
      { userId: userDetails.email },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User logged in successfully",
      token: token,
      name: userDetails.name,
      cart: userDetails.cart,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
