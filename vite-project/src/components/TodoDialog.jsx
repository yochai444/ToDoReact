import React, { useState, useEffect } from "react";
import { useAtom, useSetAtom, atom } from "jotai";
import { todosAtom, dialogOpenAtom, CurrentTodo } from "./atoms";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const subjects = ["Work", "Personal", "School", "Other"];

const TodoDialog = () => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [open, setOpen] = useAtom(dialogOpenAtom);
  const [currentTodo, setCurrentTodo] = useAtom(CurrentTodo);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: currentTodo || {
      name: "",
      subject: "",
      priority: 1,
      date: "",
    },
  });

  useEffect(() => {
    if (currentTodo) {
      reset(currentTodo);
    } else {
      reset({ name: "", subject: "", priority: 1, date: "" });
    }
  }, [currentTodo, reset]);

  const onSubmit = async (data) => {
    if (currentTodo) {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/todos/${currentTodo._id}`,
          data
        );
        setTodos((todos) =>
          todos.map((todo) =>
            todo._id === currentTodo._id ? response.data : todo
          )
        );
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/todos",
          data
        );
        setTodos((todos) => [...todos, response.data]);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{currentTodo ? "Edit Todo" : "Add Todo"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
            )}
          />
          <Controller
            name="subject"
            control={control}
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <TextField
                select
                {...field}
                label="Subject"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.subject}
                helperText={errors.subject ? errors.subject.message : ""}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="priority"
            control={control}
            rules={{
              required: "Priority is required",
              min: { value: 1, message: "Minimum value is 1" },
              max: { value: 10, message: "Maximum value is 10" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Priority"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 10 }}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.subject}
                helperText={errors.subject ? errors.subject.message : ""}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {currentTodo ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TodoDialog;
