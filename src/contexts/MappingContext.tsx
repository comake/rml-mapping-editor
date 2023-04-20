import type { NodeObject } from 'jsonld';
import { createContext } from 'react';

interface MappingContextType {
  mapping?: NodeObject,
  mappingError?: Error;
  setMapping: (mapping: NodeObject) => void,
  setMappingError: (error: Error | undefined) => void,
}

const MappingContext = createContext<MappingContextType>({ 
  mapping: undefined, 
  mappingError: undefined,
  setMapping: (mapping: NodeObject) => {},
  setMappingError: (error: Error | undefined) => {},
});

export default MappingContext;