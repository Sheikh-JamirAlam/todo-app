import express, { Request, Response } from "express";
import { authenticateJwt } from "../middleware/index";
import { Todo } from "../db";
const router = express.Router();

interface CreateTodoInput {
  title: string;
  isDone: boolean;
  userId: string | string[] | undefined;
}

router.post("/", authenticateJwt, (req: Request, res: Response) => {
  const { title }: { title: string } = req.body;
  const isDone: boolean = false;
  const userId = req.headers["userId"];

  const newTodo = new Todo<CreateTodoInput>({ title, isDone, userId });

  newTodo
    .save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/", authenticateJwt, (req: Request, res: Response) => {
  const userId = req.headers["userId"];

  Todo.find({ userId })
    .then((todos) => {
      res.status(200).json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

export default router;
