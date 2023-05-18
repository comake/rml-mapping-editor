import { createContext } from 'react';
import { ValueOf } from '../util/TypeUtil';

export const INPUT_TYPES = {
  json: 'json',
  csv: 'csv',
  xml: 'xml',
};

export const DEFAULT_INPUT_FILE_BY_TYPE = {
  [INPUT_TYPES.json]: '[\n  {\n    \n  }\n]',
  [INPUT_TYPES.csv]: 'Name, age\nAlice, 34\nBob, 68',
  [INPUT_TYPES.xml]: '',
};

export type InputType = ValueOf<typeof INPUT_TYPES>;

export interface InputFile {
  name: string;
  contents: string;
}

interface InputContextType {
  inputFiles: InputFile[];
  setInputFiles: React.Dispatch<React.SetStateAction<InputFile[]>>;
}

const InputContext = createContext<InputContextType>({
  inputFiles: [],
  setInputFiles: (inputFiles) => inputFiles,
});

export default InputContext;
