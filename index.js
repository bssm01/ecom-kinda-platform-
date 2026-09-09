import "dotenv/config";
import express from "express";
import connectdb from "./connectdb.js";
import router from "./routes/productRoute.js";
import authRouter from "./routes/userAuthRoute.js";
import dotenv from "dotenv/config.js";
import cors from "cors";



//init
const app = express();

//midleware
app.use(express.json());
app.use(cors());


//routes
app.use("/api/products", router);
app.use("/api/auth", authRouter);

//database connection
connectdb();

//server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});
