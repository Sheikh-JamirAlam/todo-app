import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { User } from "../db";
import { CustomRequest, authenticateJwt } from "../middleware";
import "dotenv/config";

const router = express.Router();
const SECRET = process.env.SECRET_KEY as string;

const signupInput = z.object({
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
  password: z.string().min(8, {
    message: "Password should be at least 8 characters",
  }),
});

router.post("/signup", async (req: Request, res: Response) => {
  const input = signupInput.safeParse(req.body);
  if (!input.success) {
    return res.status(403).json({ msg: "Invalid username: " + input.error.issues[0].message });
  }

  const { username, password } = input.data;

  const user = await User.findOne({ username });

  if (user) {
    return res.status(403).json({ msg: "User already exists" });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: encryptedPassword });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "5d" });
  return res.json({ message: "User created successfully", token });
});

router.post("/login", async (req: Request, res: Response) => {
  const input = signupInput.safeParse(req.body);
  if (!input.success) {
    return res.status(403).json({ msg: "Input error" });
  }

  const { username, password } = input.data;

  const user: { username: string; password: string; _id: string } | null = await User.findOne({ username });

  if (!user) {
    return res.status(403).json({ msg: "Invalid username or password" });
  }

  const isMatched = bcrypt.compareSync(password, user.password);
  if (!isMatched) {
    return res.status(403).json({ msg: "Invalid username or password" });
  }
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "5d" });
  return res.json({ message: "User created successfully", token });
});

router.get("/user", authenticateJwt, async (req: Request, res: Response) => {
  const userId = (req as CustomRequest).userId;

  const user = await User.findById(userId);
  if (user) {
    return res.json({ username: user.username });
  } else {
    return res.status(403).json({ msg: "User not logged in" });
  }
});

export default router;
