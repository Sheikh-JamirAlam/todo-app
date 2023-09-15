import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URL + "?retryWrites=true&w=majority");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
