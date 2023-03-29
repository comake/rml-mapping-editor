import { ReactNode, useMemo, useState } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import '../index.scss';
import { FixedLengthArray } from '../util/TypeUtil';
import DraggableViewContainer from './DraggableViewContainer';
import EditorPanel from './EditorPanel';
import Header from './Header';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import type { NodeObject } from 'jsonld'; 
import MappingContext from '../contexts/MappingContext';

const basePanelWidth = 300;

const defaultMapping = {
  '@id': 'https://example.com/1234',
  '@type': 'http://www.w3.org/ns/r2rml#TriplesMap'
};

export function RMLMappingEditor() {
  const [theme, setTheme] = useState('dark');
  const [mapping, setMapping] = useState<NodeObject>(defaultMapping);
  
  const themeContext = useMemo(
    () => ({ theme, setTheme }), 
    [ theme, setTheme ],
  );

  const mappingContext = useMemo(
    () => ({ mapping, setMapping }), 
    [ mapping, setMapping ],
  );

  const defaultBodyWidths = useMemo(() => 
    [basePanelWidth, undefined, basePanelWidth] as FixedLengthArray<number | undefined, 3>, 
    [],
  );

  const content = useMemo(() => ([
    <InputPanel />,
    <EditorPanel />,
    <OutputPanel />
  ] as FixedLengthArray<ReactNode, 3>), []);

  return (
    <ThemeContext.Provider value={themeContext}>
      <MappingContext.Provider value={mappingContext}>
        <div className={`RML-Editor ${theme}`}>
          <Header />
          <DraggableViewContainer
            defaultViewDimensions={defaultBodyWidths}
            viewContent={content}
            additionalClasses={['RML-Editor-Body']}
          />
        </div>
      </MappingContext.Provider>
    </ThemeContext.Provider>
  )
}