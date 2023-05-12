import React, { useMemo } from 'react';
import { InputFile } from '../contexts/InputContext';
import CodeEditor from './CodeEditor';
import styles from '../css/RMLMappingEditor.module.scss';
import CSVTableEditor from './CSVTableEditor';

interface InputFileEditorProps {
  inputFile: InputFile;
  onFileContentsChange: (newContent: string) => void;
}

function InputFileEditor({
  inputFile,
  onFileContentsChange,
}: InputFileEditorProps) {
  const fileType = useMemo(() => {
    const fileNameParts = inputFile.name.split('.');
    return fileNameParts[fileNameParts.length - 1];
  }, [inputFile]);

  return (
    <>
      {fileType === 'csv' && (
        <CSVTableEditor
          content={inputFile.contents}
					onContentChange={onFileContentsChange}
        />
      )}
      {fileType !== 'csv' && (
        <CodeEditor
          mode={fileType}
          code={inputFile.contents ?? ''}
          onChange={onFileContentsChange}
          classes={styles.mappingEditorCodeView}
        />
      )}
    </>
  );
}

export default InputFileEditor;
