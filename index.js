import "dotenv/config";
import express from "express";
import connectdb from "./connectdb.js";
import router from "./routes/productRoute.js";
import authRouter from "./routes/userAuthRoute.js";
import chatRouter from "./routes/chatRoute.js";
import dotenv from "dotenv/config.js";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

//init
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: true, credentials: true },
});

//midleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/products", router);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.locals.io = io;

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = String(decoded.id);
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.userId);
});

//database connection
connectdb();

//server
const port = process.env.PORT || 5000;
const server = httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});
