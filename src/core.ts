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
