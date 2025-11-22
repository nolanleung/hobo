import { router } from "../trpc";
import { createTodos, listTodos } from "./todos";

export const todosRouter = router({
  list: listTodos,
  create: createTodos,
});
