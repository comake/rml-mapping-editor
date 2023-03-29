import { useCallback, useContext, useMemo, useState } from 'react';
import MappingContext from '../contexts/MappingContext';
import { ValueOf } from '../util/TypeUtil';
import CodeEditor from './CodeEditor';

const views = {
  code: 'code',
  gui: 'gui',
}

function EditorPanel() {
  const { mapping, setMapping } = useContext(MappingContext);
  const [view, setView] = useState<ValueOf<typeof views>>(views.code);

  const changeToGuiView = useCallback(() => setView(views.gui), []);
  const changeToCodeView = useCallback(() => setView(views.code), []);

  const code = useMemo(() => {
    return mapping ? JSON.stringify(mapping, undefined, 2) : undefined;
  }, [mapping]);

  const updateMapping = useCallback((updatedMapping: string) => {
    try {
      const newMapping = JSON.parse(updatedMapping);
      setMapping(newMapping);
    } catch (error: unknown) {
      console.log('The mapping has an error');
    }
  }, [setMapping]);

  return (
    <div className='RML-Editor-Mapping-Editor'>
      <div className='RML-Editor-Panel-Header'>
        <button onClick={changeToGuiView}>GUI</button>
        <button onClick={changeToCodeView}>Code</button>
      </div>
      { view === views.code && (
        <CodeEditor 
          code={code}
          onChange={updateMapping}
          classes={'RML-Editor-Mapping-Editor-Code-View'}
        />
      )}
    </div>
  )
}

export default EditorPanel;