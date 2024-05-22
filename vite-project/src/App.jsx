import React, { useState, useEffect, useCallback } from "react";
import { Container, TextField, IconButton, Box } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useAtom } from "jotai";
import { todosAtom, editingTodoAtom, dialogOpenAtom } from "./atoms";
import TodoDialog from "./TodoDialog";
import TodoCard from "./TodoCard";

const App = () => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom);
  const [, setEditingTodo] = useAtom(editingTodoAtom);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilteredTodos(
        todos.filter((todo) =>
          todo.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, todos]);

  const handleAddTodo = (todo) => {
    setTodos((prevTodos) => {
      if (todo.id) {
        return prevTodos.map((t) => (t.id === todo.id ? todo : t));
      }
      return [...prevTodos, { ...todo, id: Date.now() }];
    });
  };

  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };

  const handleToggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" my={2}>
        <TextField
          label="Search Todos"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <IconButton color="primary" onClick={() => setDialogOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>
      {filteredTodos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          onToggleComplete={handleToggleComplete}
        />
      ))}
      <TodoDialog onSave={handleAddTodo} />
    </Container>
  );
};

export default App;
