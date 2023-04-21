import { useCallback, useContext, useEffect, useState } from 'react';
import InputContext, { INPUT_FILE_NAME_BY_TYPE, INPUT_TYPES } from '../contexts/InputContext';
import styles from '../css/RMLMappingEditor.module.scss';
import CodeEditor from './CodeEditor';

function InputPanel() {
  const { input, inputType, setInput, setInputType } = useContext(InputContext);
  const [resetInputAfterTypeChange, setResetInputAfterTypeChange] = useState(false);
  const [prevInputType, setPrevInputType] = useState(inputType);

  const changeToJSONInput = useCallback(() => setInputType(INPUT_TYPES.json), [setInputType]);
  const changeToXMLInput = useCallback(() => setInputType(INPUT_TYPES.xml), [setInputType]);

  useEffect(() => {
    if (inputType !== prevInputType) {
      setPrevInputType(inputType)
      setResetInputAfterTypeChange(!resetInputAfterTypeChange);
    }
  }, [inputType, prevInputType, resetInputAfterTypeChange])

  return (
    <div className={styles.inputPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.inputSourceName}>Source name: {INPUT_FILE_NAME_BY_TYPE[inputType]}</div>
        <button onClick={changeToJSONInput} className={`${styles.panelHeaderButton} ${inputType === INPUT_TYPES.json ? styles.panelHeaderButtonSelected : ''}`}>JSON</button>
        <button onClick={changeToXMLInput} className={`${styles.panelHeaderButton} ${inputType === INPUT_TYPES.xml ? styles.panelHeaderButtonSelected : ''}`}>XML</button>
      </div>
      <CodeEditor 
        key={`${inputType}${resetInputAfterTypeChange}`}
        mode={inputType}
        code={input ?? ''}
        onChange={setInput}
        classes={styles.mappingEditorCodeView}
      />
    </div>
  )
}

export default InputPanel;