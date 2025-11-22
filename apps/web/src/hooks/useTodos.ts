import { useTRPC } from "@/lib/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTodos() {
  const trpc = useTRPC();

  return useQuery(trpc.todos.list.queryOptions());
}

export function useCreateTodo() {
  const trpc = useTRPC();
  const queryclient = useQueryClient();

  return useMutation(
    trpc.todos.create.mutationOptions({
      onSuccess: () => {
        queryclient.invalidateQueries(trpc.todos.list.queryFilter());
      },
    }),
  );
}
