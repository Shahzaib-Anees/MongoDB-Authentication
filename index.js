import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/db/index.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/v1", authRoutes);

(async () => {
  try {
    const res = await connectDB();
    console.log(res);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
