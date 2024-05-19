import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const subjects = ["Work", "Personal", "Shopping", "Others"];

export default function TodoDialog({ open, onClose, onSave, editingTodo }) {
  // creat a states of the part value of the DOTO
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState(1);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setName(editingTodo.name);
      setSubject(editingTodo.subject);
      setPriority(editingTodo.priority);
      setDate(editingTodo.date);
    }
  }, [editingTodo]);

  const handleSave = () => {
    onSave({
      id: editingTodo?.id,
      name,
      subject,
      priority,
      date,
      completed: editingTodo?.completed || false,
    });
    setName("");
    setSubject("");
    setPriority(1);
    setDate("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editingTodo ? "Edit Todo" : "Add Todo"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          margin="normal"
        >
          {subjects.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="number"
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: 10 }}
        />
        <TextField
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
