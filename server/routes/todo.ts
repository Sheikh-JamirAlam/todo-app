import express, { Request, Response } from "express";
import { z } from "zod";
import { CustomRequest, authenticateJwt } from "../middleware/index";
import { Todo } from "../db";

const router = express.Router();

interface CreateTodoInput {
  title: string;
  isDone: boolean;
  userId: string;
}

const todoInput = z.object({
  title: z.string().min(1, {
    message: "Todo cannot be empty",
  }),
});

router.post("/", authenticateJwt, (req: Request, res: Response) => {
  const input = todoInput.safeParse(req.body);
  if (!input.success) {
    return res.status(403).json({ msg: input.error.issues[0].message });
  }

  const { title }: { title: string } = input.data;
  const isDone: boolean = false;
  const userId = (req as CustomRequest).userId;

  const newTodo = new Todo<CreateTodoInput>({ title, isDone, userId });

  newTodo
    .save()
    .then((savedTodo) => {
      return res.status(201).json(savedTodo);
    })
    .catch((err) => {
      return res.status(500).json({ error: "Failed to create a new todo" });
    });
});

router.get("/", authenticateJwt, (req: Request, res: Response) => {
  const userId = (req as CustomRequest).userId;

  Todo.find({ userId })
    .then((todos) => {
      return res.status(200).json(todos);
    })
    .catch((err) => {
      return res.status(500).json({ error: "Failed to retrieve todos" });
    });
});

router.patch("/done", authenticateJwt, (req: Request, res: Response) => {
  const { todoId }: { todoId: string } = req.body;
  const userId = (req as CustomRequest).userId;

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(updatedTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update todo" });
    });
});

export default router;
