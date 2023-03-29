import type { NodeObject } from 'jsonld';
import { createContext } from 'react';

interface MappingContextType {
  mapping?: NodeObject,
  setMapping: (mapping: NodeObject) => void,
}

const MappingContext = createContext<MappingContextType>({ 
  mapping: undefined, 
  setMapping: (mapping: NodeObject) => {},
});

export default MappingContext;