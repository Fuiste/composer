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
