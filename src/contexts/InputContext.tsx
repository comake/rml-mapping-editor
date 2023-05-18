import { createContext } from 'react';

export interface InputFile {
  name: string;
  contents: string;
}

interface InputContextType {
  inputFiles: InputFile[],
  setInputFiles: (inputFiles: InputFile[]) => void,
}

const InputContext = createContext<InputContextType>({ 
  inputFiles: [],
  setInputFiles: (inputFiles: InputFile[]) => {},
});

export default InputContext;