export type OrArray<T> = T | T[];

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' |  'unshift';

export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>>
& {
  readonly length: L 
  [I: number ] : T
  [Symbol.iterator]: () => IterableIterator<T>   
}

export type ValueOf<T> = T[keyof T];

export type ClickEvent = React.MouseEvent<HTMLButtonElement>;

export type PanelType = "input" | "editor" | "output";