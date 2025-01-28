import { Result, TaggedCause } from "./result";

export type CoreFn<R, E extends TaggedCause<any, string>, D, A> = 
    (deps : D) =>
    (args : A) => 
        Result<R, E>
