import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  registerValidation,
  loginValidation,
  user,
} from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const User = await user.findOne({ email: req.body.email });
    if (User) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ newUser, token, message: "User created successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const User = await user.findOne({ email: req.body.email });
    if (!User) {
      return res.status(404).json({ message: "user does not exist" });
    }
    const isMatch = await bcrypt.compare(req.body.password, User.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });
    }
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ User, token, message: "User logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
