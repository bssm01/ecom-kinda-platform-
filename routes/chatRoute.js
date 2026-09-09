import express from "express";
import productMiddleware from "../middleware/productMiddleware.js";
import {
  getConversation,
  getUsers,
  sendMessage,
} from "../controllers/chatController.js";

const chatRouter = express.Router();
chatRouter.use(productMiddleware);
chatRouter.get("/users", getUsers);
chatRouter.get("/:userId", getConversation);
chatRouter.post("/:userId", sendMessage);

export default chatRouter;
