import { INPUT_TYPES, PANELS } from './Constants';

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

export enum InputViewType {
  INPUTS = 'inputs',
  FUNCTIONS = 'functions',
}
export type PanelType = ValueOf<typeof PANELS>;

export type InputType = ValueOf<typeof INPUT_TYPES>;


export type Params = Record<string, { type?: string; comment?: string }>;

export type Functions = Record<
  string,
  { name: string; params: Params; description?: string }
  // TODO: Once all functions are properly defined, make type, comment and description mandatory
>;
