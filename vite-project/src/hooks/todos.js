import axios from "axios";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const todosUrl = "http://localhost:8000/api/todos";

const updateTodo = async (updatedTodo) => {
  try {
    await axios.put(`http://localhost:8000/api/todos/${todo._id}`, updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

const addTodo = async (newTodo) => {
  try {
    await axios.post("http://localhost:8000/api/todos", newTodo);
  } catch (error) {
    console.error("Error adding todo", error);
  }
};

const deleteTodo = async (todoId) => {
  try {
    await axios.delete(`http://localhost:8000/api/todos/${todoId}`);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

export const useTodos = (searchTerm) => {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get(todosUrl);
      return response.data;
    },
    initialData: [],
  });

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) =>
        todo.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [todos, searchTerm]
  );

  return {
    filteredTodos,
    isLoading,
    error,
  };
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: async () => queryClient.invalidateQueries("todos"),
    onError: async () => queryClient.invalidateQueries("todos"),
  });
};


export const useAddTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo,
    onSuccess: async () => {
      return queryClient.invalidateQueries("todos");
    },
    onError: async () => queryClient.invalidateQueries("todos"),
  });
};


export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: async () => {
      return queryClient.invalidateQueries("todos");
    },
    onError: async () => queryClient.invalidateQueries("todos"),
  });
};
