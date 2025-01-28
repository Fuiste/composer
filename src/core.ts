import type { Result, TaggedCause } from "./result";

export type Dependencies<D, Tags extends string> = {
  [Tag in Tags]: D;
};

export type CoreFn<
  R,
  E extends TaggedCause<any, string>,
  D extends Dependencies<any, string>,
  A,
> = (deps: D) => (args: A) => Result<R, E>;

export const define =
  <
    D extends Dependencies<any, string>,
    R = any,
    E extends TaggedCause<any, string> = TaggedCause<any, string>,
    A = any,
  >(
    fn: (deps: D, args: A) => Result<R, E>
  ): CoreFn<R, E, D, A> =>
  (deps) =>
  (args) =>
    fn(deps, args);
