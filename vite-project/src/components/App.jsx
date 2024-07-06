import React, { useState, useCallback } from "react";
import { Container, TextField, IconButton, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { dialogOpenAtom, CurrentTodo } from "./atoms";
import TodoDialog from "./TodoDialog";
import TodoCard from "./TodoCard";
import { useTodos } from "../hooks/todos";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const setOpen = useSetAtom(dialogOpenAtom);
  const setCurrentTodo = useSetAtom(CurrentTodo);

  const { filteredTodos, isLoading, error } = useTodos(searchTerm);

  const handleOpen = useCallback(() => {
    setCurrentTodo(null);
    setOpen(true);
  });

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching todos: {error.message}</div>;
  }

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
