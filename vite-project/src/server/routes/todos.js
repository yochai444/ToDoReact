import { todoSchema } from "../validations/validationTodos.js";
import { getDb } from "../db.js";
import express from "express";
import { ObjectId } from "mongodb";

export const router = express.Router();

router.post("/", async (req, res) => {
  const todo = {
    name: req.body.name,
    subject: req.body.subject,
    priority: req.body.priority,
    date: new Date(req.body.date),
    completed: false,
  };
  try {
    const db = getDb();

    const result = await db.collection("todos").insertOne(todo);
    const doc = await db
      .collection("todos")
      .findOne({ _id: result.insertedId });
    res.status(200).json(doc);
  } catch (err) {
    console.error("Error creating todos:", err.message);
    res.status(400).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
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

    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id) }, updatedTodo);

    //if (result.matchedCount === 0) {
    //throw new Error("todos not found");
    //}
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

    const result = await db
      .collection("todos")
      .deleteOne({ _id: new ObjectId(id) });
    //if (result.deletedCount === 0) {
    //return res.status(404).json({ message: "Todo not found" });
    //}
    res.json({ message: "Deleted Todo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
