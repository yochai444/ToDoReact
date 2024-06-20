import React from "react";
import { useAtom, useSetAtom, atom } from "jotai";
import { todosAtom, dialogOpenAtom, CurrentTodo } from "./atoms";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import axios from "axios";

const TodoCard = ({ todo }) => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [open, setOpen] = useAtom(dialogOpenAtom);
  const [currentTodo, setCurrentTodo] = useAtom(CurrentTodo);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${todo._id}`);
      setTodos((todos) => todos.filter((t) => t._id !== todo._id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = () => {
    setCurrentTodo(todo);
    setOpen(true);
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await axios.put(
        `http://localhost:8000/api/todos/${todo._id}`,
        updatedTodo
      );
      setTodos((todos) =>
        todos.map((t) => (t._id === todo._id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Card
      style={{
        margin: "10px 0",
        backgroundColor: todo.completed ? "#e0ffe0" : "white",
      }}
    >
      <CardContent>
        <Typography variant="h6">{todo.name}</Typography>
        <Typography variant="body1">Subject: {todo.subject}</Typography>
        <Typography variant="body1">Priority: {todo.priority}</Typography>
        <Typography variant="body1">
          Date: {new Date(todo.date).toLocaleDateString()}
        </Typography>
        <IconButton onClick={handleToggleComplete}>
          <DoneIcon style={{ color: todo.completed ? "green" : "gray" }} />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default TodoCard;
