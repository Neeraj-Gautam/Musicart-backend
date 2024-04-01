const express = require("express");
const Feedback = require("../models/feedback");
const User = require("../models/user");

const addFeedback = async (req, res) => {
  try {
    const { feedbackType, feedbackMessage } = req.body;
    const email = req.userId;

    const userDetails = await User.findOne({ email: email });
    if (!userDetails) {
      return res.status(409).json({ message: "User does not exists" });
    }

    const newFeedback = new Feedback({
      userId: email,
      feedbackType: feedbackType,
      feedback: feedbackMessage,
      createdAt: new Date(),
    });

    const response = await newFeedback.save();
    return res.json(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addFeedback };
