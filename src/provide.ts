import type { CoreFn, Dependencies } from "./core";
import type { TaggedCause } from "./result";

export const provide = <
  R,
  E extends TaggedCause<any, string>,
  D extends Dependencies<any, string>,
  A,
>(
  fn: CoreFn<R, E, D, A>
) => ({
  with: (deps: D) => fn(deps),
});
