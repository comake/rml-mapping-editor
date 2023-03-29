import type { NodeObject } from 'jsonld';
import { createContext } from 'react';

const MappingContext = createContext({ 
  mapping: undefined, 
  setMapping: (mapping: NodeObject) => {},
});

export default MappingContext;