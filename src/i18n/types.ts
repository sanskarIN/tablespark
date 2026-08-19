export type WidenMessages<T> = T extends (...args: infer Args) => unknown
  ? (...args: Args) => string
  : T extends string
    ? string
    : T extends object
      ? { readonly [Key in keyof T]: WidenMessages<T[Key]> }
      : T;
