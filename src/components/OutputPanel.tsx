import { useContext, useMemo } from 'react';
import OutputContext from '../contexts/OutputContext';
import styles from '../css/RMLMappingEditor.module.scss';
import CodeEditor from './CodeEditor';

function OutputPanel() {
  const { output } = useContext(OutputContext);
  const stringOutput = useMemo(() => JSON.stringify(output, undefined, 2), [output]);
  return (
    <div className={styles.outputPanel}>
      <CodeEditor 
        key={stringOutput}
        code={stringOutput}
        locked
        disableLinting
        classes={styles.mappingEditorCodeView}
      />
    </div>
  )
}

export default OutputPanel;