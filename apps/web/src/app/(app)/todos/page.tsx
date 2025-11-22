"use client";

import { useCreateTodo, useTodos } from "@/hooks/useTodos";
import { Button } from "@repo/ui/components/button";

export default function TodosPage() {
  const { data: { data: todos = [] } = {}, isLoading, error } = useTodos();
  const { mutate: create } = useCreateTodo();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading todos: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Todo List</h1>
      <Button onClick={() => create({ title: "New Todo" })}>Add Todo</Button>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="rounded border p-2">
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
