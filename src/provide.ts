import { CoreFn } from "./core";

export const provide = <R, E, D, A>(fn: CoreFn<R, E, D, A>) => ({
  with: (deps: D) => fn(deps),
});
