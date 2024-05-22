import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from "@mui/icons-material";

export default function TodoCard({ todo, onDelete, onEdit, onToggleComplete }) {
  return (
    <Card variant="outlined" style={{ marginBottom: 16 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="h6"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.name}
            </Typography>
            <Typography color="textSecondary">{todo.subject}</Typography>
            <Typography color="textSecondary">
              Priority: {todo.priority}
            </Typography>
            <Typography color="textSecondary">Due: {todo.date}</Typography>
          </Box>
          <Box>
            <IconButton
              onClick={() => onToggleComplete(todo.id)}
              color={todo.completed ? "success" : "default"}
            >
              <DoneIcon />
            </IconButton>
            <IconButton onClick={() => onEdit(todo)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
