import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import { user } from "../models/userModel.js";

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getUsers = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = { _id: { $ne: req.user } };
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await user
      .find(filter)
      .select("username email image")
      .lean()
      .limit(30);
    res.json({
      users: users.map((chatUser) => ({
        id: String(chatUser._id),
        username: chatUser.username,
        email: chatUser.email,
        image: chatUser.image,
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Could not load users" });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;
  if (!validId(userId) || userId === String(req.user)) {
    return res.status(400).json({ message: "Invalid recipient" });
  }
  try {
    const recipient = await user
      .findById(userId)
      .select("username email image");
    if (!recipient) return res.status(404).json({ message: "User not found" });
    const messages = await Message.find({
      $or: [
        { sender: req.user, recipient: userId },
        { sender: userId, recipient: req.user },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json({ recipient, messages });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Could not load conversation" });
  }
};

export const sendMessage = async (req, res) => {
  const { userId } = req.params;
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
  if (!validId(userId) || userId === String(req.user)) {
    return res.status(400).json({ message: "Invalid recipient" });
  }
  if (!text || text.length > 2000) {
    return res
      .status(400)
      .json({ message: "Message must contain 1 to 2000 characters" });
  }
  try {
    if (!(await user.exists({ _id: userId }))) {
      return res.status(404).json({ message: "User not found" });
    }
    const message = await Message.create({
      sender: req.user,
      recipient: userId,
      text,
    });
    req.app.locals.io.to(String(userId)).emit("message:new", message);
    res.status(201).json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Could not send message" });
  }
};
