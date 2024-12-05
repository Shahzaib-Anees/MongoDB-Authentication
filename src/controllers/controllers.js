import {
  generateAccessToken,
  generateRefreshToken,
  decryptPassword,
} from "../methods/AuthenticationMethods/AuthenticationMethods.js";
import userSchema from "../models/users.models.js";

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const ifEmailFound = await userSchema.findOne({ email });
  if (ifEmailFound)
    return res.status(400).json({ message: "Email already exists" });

  const newUser = await userSchema.create({
    email,
    password,
  });
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);
  res.cookie("refreshToken", refreshToken, {
    http: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: "User registered successfully",
    data: newUser,
    ACCESS_TOKEN: accessToken,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const user = await userSchema.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "No user exists with this email address" });
  }

  const isValidPassword = await decryptPassword(password, user?.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Incorrect password" });
  } else {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      http: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      ACCESS_TOKEN: accessToken,
    });
  }
};

const logOutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "User logged out successfully" });
};
export { registerUser, loginUser , logOutUser };
