import { registerUser, loginUser } from "../controllers/userAuth.js";
import express from "express";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
