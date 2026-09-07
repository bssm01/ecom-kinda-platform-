import "dotenv/config";
import express from "express";
import connectdb from "./connectdb.js";
import router from "./routes/productRoute.js";
import authRouter from "./routes/userAuthRoute.js";
import dotenv from "dotenv/config.js";



//init
const app = express();

//midleware
app.use(express.json());


//routes
app.use("/api/products", router);
app.use("/api/auth", authRouter);

//database connection
connectdb();

//server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

server.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});
