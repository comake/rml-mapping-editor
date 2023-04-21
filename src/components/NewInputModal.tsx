import Modal from './Modal';
import styles from '../css/RMLMappingEditor.module.scss';
import { useCallback, useContext } from 'react';
import InputContext, { DEFAULT_INPUT_FILE_BY_TYPE, INPUT_TYPES, InputType } from '../contexts/InputContext';

export interface NewInputModalProps {
  close: () => void;
}

function NewInputModal({ close }: NewInputModalProps) {
  const { inputFiles, setInputFiles } = useContext(InputContext);

  const createNewInputFileOfType = useCallback((type: InputType) => {
    const jsonFileNames = inputFiles.reduce((arr: string[], inputFile): string[] => {
      if (inputFile.name.endsWith(`.${type}`)) {
        arr.push(inputFile.name)
      }
      return arr;
    }, []);
    const baseTitle = 'untitled';
    let index = 0;
    let title = `${baseTitle}${index === 0 ? '' : index}.${type}`;
    while(jsonFileNames.includes(title)) {
      index += 1;
      title = `${baseTitle}${index === 0 ? '' : index}.${type}`
    }
    setInputFiles([ 
      ...inputFiles, 
      { name: title, contents: DEFAULT_INPUT_FILE_BY_TYPE[type] } 
    ]);
    close();
  }, [close, inputFiles, setInputFiles]);

  const createNewJSONInput = useCallback(() => {
    createNewInputFileOfType(INPUT_TYPES.json);
  }, [createNewInputFileOfType]);

  const createNewXMLInput = useCallback(() => {
    createNewInputFileOfType(INPUT_TYPES.xml);
  }, [createNewInputFileOfType]);
  
  return (
    <Modal header={'Add a new input file'} close={close} additionalClasses={styles.newInputModal}>
      <div className={styles.newInputModalBody}>
        <p>Select a file type</p>
        <button className={styles.newInputTypeButton} onClick={createNewJSONInput}>JSON</button>
        {/* <button className={styles.newInputTypeButton}>CSV</button> */}
        <button className={styles.newInputTypeButton} onClick={createNewXMLInput}>XML</button>
      </div>
    </Modal>
  )
}

export default NewInputModal;