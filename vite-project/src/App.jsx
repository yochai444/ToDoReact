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

  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom);
  const [editingTodo, setEditingTodo] = useAtom(editingTodoAtom);

  const handleAddTodo = (todo) => {
    if (editingTodo) {
      setTodos(todos.map((t) => (t.id === editingTodo.id ? todo : t)));
      setEditingTodo(null);
    } else {
      setTodos([...todos, { ...todo, id: Date.now() }]);
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // change  the status of editing and start to edit
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setDialogOpen(true);
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // filter search on the todos arrr if there is, oter  its the same
  const filteredTodos = todos.filter((todo) =>
    todo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
