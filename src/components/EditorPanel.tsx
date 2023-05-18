import { useCallback, useContext, useMemo, useState } from 'react';
import MappingContext from '../contexts/MappingContext';
import { ValueOf } from '../util/TypeUtil';
import CodeEditor from './CodeEditor';
import styles from '../css/RMLMappingEditor.module.scss';

const views = {
  code: 'code',
  form: 'form',
  dnd: 'dnd',
}

function EditorPanel() {
  const { mapping, setMapping, mappingError } = useContext(MappingContext);
  const [view, setView] = useState<ValueOf<typeof views>>(views.code);

  const changeToDndView = useCallback(() => setView(views.dnd), []);
  const changeToFormView = useCallback(() => setView(views.form), []);
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
    <div className={styles.mappingEditor}>
      <div className={styles.panelHeader}>
        <div className={styles.stretch}></div>
        <button onClick={changeToCodeView} className={`${styles.headerButton} ${view === views.code ? styles.headerButtonSelected : ''}`}>Code</button>
        <button onClick={changeToDndView} className={`${styles.headerButton} ${view === views.dnd ? styles.headerButtonSelected : ''}`}>Drag & Drop</button>
        <button onClick={changeToFormView} className={`${styles.headerButton} ${view === views.form ? styles.headerButtonSelected : ''}`}>Form</button>
      </div>
      { view === views.code && (
        <CodeEditor 
          code={code}
          onChange={updateMapping}
          classes={styles.mappingEditorCodeView}
        />
      )}
      <div className={styles.mappingError}>
        { mappingError ? `Mapping error: ${mappingError.message}` : '' }
      </div>
    </div>
  )
}

export default EditorPanel;