import React, { useState, useEffect } from "react";
import { Container, TextField, IconButton, Box, Button } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useAtom, useSetAtom, atom } from "jotai";
import axios from "axios";
import { todosAtom, dialogOpenAtom, CurrentTodo } from "./atoms";
import TodoDialog from "./TodoDialog";
import TodoCard from "./TodoCard";

const App = () => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useAtom(dialogOpenAtom);
  const [currentTodo, setCurrentTodo] = useAtom(CurrentTodo);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, [setTodos]);

  const handleOpen = () => {
    setCurrentTodo(null);
    setOpen(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box display="flex" alignItems="center" my={2}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleSearch}
        />
        <IconButton color="primary" onClick={handleOpen}>
          <AddIcon />
        </IconButton>
      </Box>

      {filteredTodos.map((todo) => (
        <TodoCard key={todo._id} todo={todo} />
      ))}

      <TodoDialog />
    </Container>
  );
};

export default App;
