import { router } from "../trpc";
import { todosRouter } from "./todos";
import { usersRouter } from "./users";
import { stripeRouter } from "./stripe";
import { waitlistRouter } from "./waitlist";

export const appRouter = router({
  todos: todosRouter,
  users: usersRouter,
  stripe: stripeRouter,
  waitlist: waitlistRouter,
});

export type AppRouter = typeof appRouter;
