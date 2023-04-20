import { createContext } from 'react';
import { ValueOf } from '../util/TypeUtil';

export const INPUT_TYPES = {
  json: 'json',
  csv: 'csv',
  xml: 'xml',
}

export const INPUT_FILE_NAME_BY_TYPE = {
  [INPUT_TYPES.json]: 'input.json',
  [INPUT_TYPES.csv]: 'input.csv',
  [INPUT_TYPES.xml]: 'input.xml'
}

export type InputType = ValueOf<typeof INPUT_TYPES>;

interface InputContextType {
  input?: string,
  inputType: InputType;
  setInput: (input: string) => void,
  setInputType: (inputType: string) => void,
}

const InputContext = createContext<InputContextType>({ 
  input: '',
  inputType: INPUT_TYPES.json,
  setInput: (input: string) => {},
  setInputType: (inputType: InputType) => {},
});

export default InputContext;