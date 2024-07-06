import {
  todoSchema,
  updateTodoSchema,
} from "../validations/validationTodos.js";
import { validateMiddleware } from "../validations/postValidation.js";
import {
  getDb,
  addToCollection,
  findDocument,
  updateDocument,
  deleteDocument,
} from "../db.js";
import express from "express";
import { ObjectId } from "mongodb";

export const router = express.Router();

router.post("/", validateMiddleware(todoSchema), async (req, res) => {
  const todo = {
    name: req.body.name,
    subject: req.body.subject,
    priority: req.body.priority,
    date: new Date(req.body.date),
    completed: false,
  };
  try {
    const db = getDb();

    const result = addToCollection("todos", todo);
    const doc = findDocument("todos", { _id: result.insertedId });
    res.status(200).json(doc);
  } catch (err) {
    console.error("Error creating todos:", err.message);
    res.status(400).send(err.message);
  }
});

router.put("/:id", validateMiddleware(updateTodoSchema), async (req, res) => {
  const id = req.params.id;
  const updatedTodo = {
    $set: {
      name: req.body.name,
      subject: req.body.subject,
      priority: req.body.priority,
      date: new Date(req.body.date),
      completed: req.body.completed,
    },
  };

  try {
    const db = getDb();

    const result = updateDocument("todos", id, updatedTodo);

    res.json({ _id: id, ...req.body });
  } catch (err) {
    console.error("Error updating todos:", err.message);
    res.status(400).send(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const todos = await db.collection("todos").find().toArray();
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error retrieving todos:", err.message);
    res.status(500).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const db = getDb();

    const result = deleteDocument("todos", id);

    res.json({ message: "Deleted Todo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
