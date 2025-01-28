export type Success<R> = {
  value: R;
  status: "success";
};

export type TaggedCause<C, Tag extends string> = C & { _tag: Tag };

export type Failure<E extends TaggedCause<any, string>> = {
  cause: E;
  status: "failure";
};

export type Result<R, E> = Success<R> | Failure<E>;

export const succeed = <R>(value: R): Success<R> => ({
  status: "success",
  value,
});

export const fail = <E, T extends string>(
  tag: T,
  cause: E
): Failure<TaggedCause<E, T>> => ({
  status: "failure",
  cause: {
    ...cause,
    _tag: tag,
  },
});

export type CoreFn<R, E extends TaggedCause<any, string>, D, A> = (
  deps: D
) => (args: A) => Result<R, E>;

export const provide = <R, E, D, A>(fn: CoreFn<R, E, D, A>) => ({
  with: (deps: D) => fn(deps),
});

type ComposeTwo<
  F1 extends CoreFn<any, any, any, any>,
  F2 extends CoreFn<any, any, any, any>,
> =
  F1 extends CoreFn<infer R1, infer E1, infer D1, infer A1>
    ? F2 extends CoreFn<infer R2, infer E2, infer D2, infer A2>
      ? A2 extends R1
        ? CoreFn<R2, E1 | E2, D1 & D2, A1>
        : never
      : never
    : never;

export type ComposedFn<Fns extends CoreFn<any, any, any, any>[]> = Fns extends [
  CoreFn<infer R, infer E, infer D, infer A>,
]
  ? CoreFn<R, E, D, A>
  : Fns extends [infer F1, infer F2, ...infer Rest]
    ? F1 extends CoreFn<any, any, any, any>
      ? F2 extends CoreFn<any, any, any, any>
        ? Rest extends CoreFn<any, any, any, any>[]
          ? ComposedFn<[ComposeTwo<F1, F2>, ...Rest]>
          : never
        : never
      : never
    : never;

export const compose = <
  Fns extends [CoreFn<any, any, any, any>, ...CoreFn<any, any, any, any>[]],
>(
  ...fns: Fns
): ComposedFn<Fns> =>
  ((deps) => (args) =>
    fns.reduce<Result<any, any>>(
      (acc, fn) => (acc.status === "failure" ? acc : fn(deps)(acc.value)),
      succeed(args)
    )) as ComposedFn<Fns>;
