import { CoreFn } from "./core";
import { Result, succeed } from "./result";

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
  ((deps) => (args) => {
    let currentArg = args;
    let lastResult: Result<any, any> = succeed(undefined);

    for (const fn of fns) {
      const result = fn(deps)(currentArg);
      if (result.status === "failure") return result;

      currentArg = result.value;
      lastResult = result;
    }

    return lastResult;
  }) as ComposedFn<Fns>;
