import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import ThemeContext, { THEMES } from '../contexts/ThemeContext';
import styles from '../css/RMLMappingEditor.module.scss';
import { FixedLengthArray } from '../util/TypeUtil';
import DraggableViewContainer from './DraggableViewContainer';
import EditorPanel from './EditorPanel';
import Header from './Header';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import type { NodeObject } from 'jsonld'; 
import MappingContext from '../contexts/MappingContext';
import InputContext, { INPUT_FILE_NAME_BY_TYPE, INPUT_TYPES, InputType } from '../contexts/InputContext';
import OutputContext from '../contexts/OutputContext';
import * as RMLMapper from '@comake/rmlmapper-js';

const BASE_PANEL_WIDTH = 400;
const RUN_MAPPING_TIMEOUT_DURATION = 500;

const defaultMapping = {
  "@context": {
    "rr": "http://www.w3.org/ns/r2rml#",
    "rml": "http://semweb.mmlab.be/ns/rml#",
  },
  '@type': 'http://www.w3.org/ns/r2rml#TriplesMap',
  "rml:logicalSource": {
    "@type": "rml:LogicalSource",
    "rml:iterator": "$",
    "rml:referenceFormulation": "http://semweb.mmlab.be/ns/ql#JSONPath",
    "rml:source": "input.json"
  },
  "rr:subject": "https://example.com/mappingSubject",
  "rr:predicateObjectMap": [

  ]
};

const defaultJSONInput = '{\n  \n}';
const defaultCSVInput = '';
const defaultXMLInput = '';

const defaultInputType = INPUT_TYPES.json;

export function RMLMappingEditor() {
  const [theme, setTheme] = useState(THEMES.dark);
  const [mapping, setMapping] = useState<NodeObject>(defaultMapping);
  const [mappingError, setMappingError] = useState<Error>();
  const [input, setInput] = useState<string>(defaultJSONInput);
  const [inputType, setInputType] = useState<InputType>(defaultInputType);
  const [output, setOutput] = useState<NodeObject[]>();
  const runMappingTimeout = useRef<ReturnType<typeof setTimeout>>();
  
  const themeContext = useMemo(
    () => ({ theme, setTheme }), 
    [ theme, setTheme ],
  );

  const inputContext = useMemo(
    () => ({ input, inputType, setInputType, setInput }), 
    [ input, setInput, inputType, setInputType ],
  );

  const outputContext = useMemo(
    () => ({ output, setOutput }), 
    [ output, setOutput ],
  );

  const mappingContext = useMemo(
    () => ({ mapping, setMapping, mappingError, setMappingError }), 
    [ mapping, setMapping, mappingError, setMappingError ],
  );

  const defaultBodyWidths = useMemo(() => 
    [BASE_PANEL_WIDTH, undefined, BASE_PANEL_WIDTH] as FixedLengthArray<number | undefined, 3>, 
    [],
  );

  useEffect(() => {
    if (inputType === INPUT_TYPES.json) {
      setInput(defaultJSONInput);
    } else if (inputType === INPUT_TYPES.csv) {
      setInput(defaultCSVInput);
    } else if (inputType === INPUT_TYPES.xml) {
      setInput(defaultXMLInput);
    }
  }, [inputType]);

  useEffect(() => {
    async function runMapping() {
      setMappingError(undefined);
      
      const inputFiles = { [INPUT_FILE_NAME_BY_TYPE[inputType]]: input };
      try {
        const result = await RMLMapper.parseJsonLd(mapping, inputFiles) as NodeObject[];
        setOutput(result);
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          setMappingError(error);
        }
      }
    }

    if (runMappingTimeout.current) {
      clearTimeout(runMappingTimeout.current);
    }
    runMappingTimeout.current = setTimeout(runMapping, RUN_MAPPING_TIMEOUT_DURATION);
  }, [input, inputType, mapping]);

  const content = useMemo(() => ([
    <InputPanel />,
    <EditorPanel />,
    <OutputPanel />
  ] as FixedLengthArray<ReactNode, 3>), []);

  return (
    <ThemeContext.Provider value={themeContext}>
      <MappingContext.Provider value={mappingContext}>
        <InputContext.Provider value={inputContext}>
          <OutputContext.Provider value={outputContext}>
            <div className={theme === THEMES.dark ? styles.rmlEditorDark : styles.rmlEditorLight}>
              <Header />
              <DraggableViewContainer
                defaultViewDimensions={defaultBodyWidths}
                viewContent={content}
                additionalClasses={[styles.body]}
              />
            </div>
          </OutputContext.Provider>
        </InputContext.Provider>
      </MappingContext.Provider>
    </ThemeContext.Provider>
  )
}