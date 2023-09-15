import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../db";
require("dotenv").config();

const router = express.Router();
const SECRET = process.env.SECRET_KEY as string;

export const signupInput = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username cannot be empty",
    })
    .max(20, {
      message: "Username must be 20 characters or less",
    })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  const input = signupInput.safeParse(req.body);
  if (!input.success) {
    return res.status(403).json({ msg: "Invalid username: " + input.error.issues[0].message });
  }

  const { username, password } = input.data;

  const user = await User.findOne({ username });

  if (user) {
    return res.status(403).json({ msg: "User already exists" });
  }
  const newUser = new User({ username, password });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "5d" });
  res.json({ message: "User created successfully", token });
});

router.post("/login", async (req, res) => {
  const input = signupInput.safeParse(req.body);
  if (!input.success) {
    return res.status(403).json({ msg: "Input error" });
  }

  const { username, password } = input.data;

  const user = await User.findOne({ username, password });

  if (user) {
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "5d" });
    res.json({ message: "User created successfully", token });
  }
  return res.status(403).json({ msg: "Invalid username or password" });
});

export default router;
