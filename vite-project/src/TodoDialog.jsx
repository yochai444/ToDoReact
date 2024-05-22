import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useAtom } from "jotai";
import { editingTodoAtom, dialogOpenAtom } from "./atoms";

const subjects = ["Work", "Personal", "Shopping", "Others"];

const TodoDialog = ({ onSave }) => {
  const [editingTodo, setEditingTodo] = useAtom(editingTodoAtom);
  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingTodo) {
      reset(editingTodo);
    } else {
      reset({ name: "", subject: "", priority: 1, date: "" });
    }
  }, [editingTodo, reset]);

  const onSubmit = (data) => {
    onSave({
      ...data,
      id: editingTodo?.id || Date.now(),
      completed: editingTodo?.completed || false,
    });
    setDialogOpen(false);
    setEditingTodo(null);
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>{editingTodo ? "Edit Todo" : "Add Todo"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
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
            defaultValue=""
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Subject"
                fullWidth
                margin="normal"
                error={!!errors.subject}
                helperText={errors.subject ? errors.subject.message : ""}
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
            defaultValue={1}
            rules={{
              required: "Priority is required",
              min: { value: 1, message: "Minimum value is 1" },
              max: { value: 10, message: "Maximum value is 10" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Priority"
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 10 }}
                error={!!errors.priority}
                helperText={errors.priority ? errors.priority.message : ""}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            defaultValue=""
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date ? errors.date.message : ""}
              />
            )}
          />
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;
