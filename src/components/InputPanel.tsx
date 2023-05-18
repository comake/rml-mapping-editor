import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import InputContext from "../contexts/InputContext";
import styles from "../css/RMLMappingEditor.module.scss";
import CodeEditor from "./CodeEditor";
import { ReactComponent as PlusIcon } from "../images/plus.svg";
import { ReactComponent as DownArrow } from "../images/down-arrow.svg";
import { INPUT_TYPES } from '../util/Constants';

const views = {
  inputs: "Input Files",
  // functions: 'Functions',
};

export interface InputPanelProps {
  addNewInput: () => void;
}

function InputPanel({ addNewInput }: InputPanelProps) {
  const [view, setView] = useState(views.inputs);
  const { inputFiles, setInputFiles } = useContext(InputContext);
  const [selectedInputFileIndex, setSelectedInputFileIndex] =
    useState<number>();
  const selectedInputFile = useMemo(
    () =>
      selectedInputFileIndex !== undefined
        ? inputFiles[selectedInputFileIndex]
        : undefined,
    [inputFiles, selectedInputFileIndex]
  );
  const [prevInputFilesLength, setPrevInputFilesLength] = useState<number>(
    inputFiles.length
  );

  const inputType = useMemo(() => {
    if (selectedInputFile) {
      if (selectedInputFile.name.endsWith(".json")) {
        return INPUT_TYPES.json;
      } else if (selectedInputFile.name.endsWith(".xml")) {
        return INPUT_TYPES.xml;
      } else if (selectedInputFile.name.endsWith(".csv")) {
        return INPUT_TYPES.csv;
      }
    }
  }, [selectedInputFile]);

  const changeToInputView = useCallback(() => setView(views.inputs), [setView]);

  const updateSelectedInputFile = useCallback(
    (input: string) => {
      if (selectedInputFileIndex !== undefined) {
        setInputFiles(
          inputFiles.map((inputFile, index) => {
            if (index === selectedInputFileIndex) {
              return { ...inputFile, contents: input };
            }
            return inputFile;
          })
        );
      }
    },
    [selectedInputFileIndex, setInputFiles, inputFiles]
  );

  const closeSelectedInputFile = useCallback(
    () => setSelectedInputFileIndex(undefined),
    []
  );

  useEffect(() => {
    if (inputFiles.length !== prevInputFilesLength) {
      setPrevInputFilesLength(inputFiles.length);
      if (inputFiles.length > prevInputFilesLength) {
        setSelectedInputFileIndex(inputFiles.length - 1);
      }
    }
  }, [inputFiles, prevInputFilesLength]);

  return (
    <div className={styles.inputPanel}>
      <div className={styles.panelHeader}>
        <button
          onClick={changeToInputView}
          className={`${styles.headerButton} ${
            view === views.inputs ? styles.headerButtonSelected : ""
          }`}
        >
          Input Files
        </button>
        <div className={styles.stretch}></div>
        <button
          onClick={addNewInput}
          className={`${styles.headerButton} ${styles.iconHeaderButton}`}
        >
          <PlusIcon />
        </button>
        {/* <button onClick={changeToJSONInput} className={`${styles.headerButton} ${inputType === INPUT_TYPES.json ? styles.headerButtonSelected : ''}`}>JSON</button>
        <button onClick={changeToXMLInput} className={`${styles.headerButton} ${inputType === INPUT_TYPES.xml ? styles.headerButtonSelected : ''}`}>XML</button> */}
      </div>
      {!selectedInputFile && (
        <div className={styles.inputFilesList}>
          {inputFiles.map((inputFile, index) => {
            return (
              <div
                key={index}
                className={styles.inputFile}
                onClick={setSelectedInputFileIndex.bind(null, index)}
              >
                {inputFile.name}
              </div>
            );
          })}
        </div>
      )}
      {selectedInputFile && (
        <>
          <div className={styles.panelHeader}>
            <button
              onClick={closeSelectedInputFile}
              className={`${styles.headerButton} ${styles.iconHeaderButton}`}
            >
              <DownArrow className={styles.backArrow} />
            </button>
            <div className={styles.inputSourceName}>
              {selectedInputFile.name}
            </div>
          </div>
          <CodeEditor
            key={selectedInputFileIndex}
            mode={inputType}
            code={selectedInputFile.contents ?? ""}
            onChange={updateSelectedInputFile}
            classes={styles.mappingEditorCodeView}
          />
        </>
      )}
    </div>
  );
}

export default InputPanel;
