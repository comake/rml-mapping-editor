import { createContext } from 'react';
import { NodeObject } from 'jsonld';

interface OutputContextType {
  output?: NodeObject[],
  setOutput: (output: NodeObject[]) => void,
}

const OutputContext = createContext<OutputContextType>({ 
  output: undefined,
  setOutput: (output: NodeObject[]) => {},
});

export default OutputContext;