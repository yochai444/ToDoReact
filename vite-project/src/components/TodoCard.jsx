import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { todosAtom, dialogOpenAtom, CurrentTodo } from "./atoms";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import { useDeleteTodoMutation, useUpdateTodoMutation } from "../hooks/todos";

const TodoCard = ({ todo }) => {
  const setOpen = useSetAtom(dialogOpenAtom);
  const setCurrentTodo = useSetAtom(CurrentTodo);

  const { mutate: updatedTodoMutation } = useUpdateTodoMutation();
  const { mutate: deleteTodoMutation } = useDeleteTodoMutation();

  const handleDelete = async () => {
    return deleteTodoMutation(todo._id);
  };

  const handleEdit = () => {
    setCurrentTodo(todo);
    setOpen(true);
  };

  const handleToggleComplete = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    return updatedTodoMutation(updatedTodo);
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
