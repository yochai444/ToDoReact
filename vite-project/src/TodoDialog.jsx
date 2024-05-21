import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const subjects = ["Work", "Personal", "Shopping", "Others"];

const TodoDialog = ({ open, onClose, onSave, editingTodo }) => {
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      priority: 1,
      date: "",
    },
  });

  useEffect(() => {
    if (editingTodo) {
      setValue("name", editingTodo.name);
      setValue("subject", editingTodo.subject);
      setValue("priority", editingTodo.priority);
      setValue("date", editingTodo.date);
    }
  }, [editingTodo, setValue]);

  const onSubmit = (data) => {
    onSave({
      ...data,
      id: editingTodo?.id || Date.now(),
      completed: editingTodo?.completed || false,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editingTodo ? "Edit Todo" : "Add Todo"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyPress}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="subject"
            control={control}
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Subject"
                fullWidth
                margin="normal"
              >
                {subjects.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
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
              min: { value: 1, message: "Priority must be at least 1" },
              max: { value: 10, message: "Priority must be at most 10" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Priority"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
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
                type="date"
                label="Date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoDialog;
``;
