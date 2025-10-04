import { authProcedure, router } from "../trpc";

export const todosRouter = router({
  list: authProcedure.query(({ ctx }) => {
    return {
      success: true,
      data: [],
      requesterId: ctx.user.id,
    };
  }),
});
