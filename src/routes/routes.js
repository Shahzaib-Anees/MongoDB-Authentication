import express from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
} from "../controllers/controllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
export default router;
