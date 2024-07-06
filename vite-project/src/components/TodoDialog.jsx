import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { dialogOpenAtom, CurrentTodo } from "./atoms";
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
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useAddTodoMutation } from "../hooks/todos";

const subjects = ["Work", "Personal", "School", "Other"];

const TodoDialog = () => {
  const [open, setOpen] = useAtom(dialogOpenAtom);
  const [currentTodo, setCurrentTodo] = useAtom(CurrentTodo);
  const queryClient = useQueryClient();

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

  const { mutate: addTodoMutation } = useAddTodoMutation();

  const updateMutation = useMutation(
    (updatedTodo) =>
      axios.put(
        `http://localhost:8000/api/todos/${updatedTodo._id}`,
        updatedTodo
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
        setOpen(false);
        reset();
      },
    }
  );

  const onSubmit = (data) => {
    if (currentTodo) {
      updateMutation.mutate({ ...currentTodo, ...data });
    } else {
      addTodoMutation(data);
    }
    setOpen(false);
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
                error={!!errors.date}
                helperText={errors.date ? errors.date.message : ""}
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
