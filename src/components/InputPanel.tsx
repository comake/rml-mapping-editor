import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import InputContext, { INPUT_TYPES } from "../contexts/InputContext";
import styles from "../css/RMLMappingEditor.module.scss";
import CodeEditor from "./CodeEditor";
import { ReactComponent as PlusIcon } from "../images/plus.svg";
import { ReactComponent as DownArrow } from "../images/down-arrow.svg";

const views = {
  inputs: "Input Files",
  functions: "Functions",
};
type ViewType = keyof typeof views;

const functionList = [
  {
    name: "Capitalize",
    function: (str: string) => str.toUpperCase(),
  },
  {
    name: "Lower case",
    function: (str: string) => str.toLowerCase(),
  },
  {
    name: "Concatenate",
    function: (strList: string[], delimiter: string = "-") =>
      strList.join(delimiter),
  },
];

export interface InputPanelProps {
  addNewInput: () => void;
}

function InputPanel({ addNewInput }: InputPanelProps) {
  const [view, setView] = useState<ViewType>("inputs");
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

  const changeView = useCallback((view: ViewType) => setView(view), [setView]);

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
        {/* <button onClick={changeToInputView} className={`${styles.panelHeaderButton} ${view === views.inputs ? styles.panelHeaderButtonSelected : ''}`}>Input Files</button> */}
        {Object.keys(views).map((viewType) => (
          <button
            key={viewType}
            className={`${styles.panelHeaderButton} ${
              view === viewType ? styles.panelHeaderButtonSelected : ""
            }`}
            onClick={changeView.bind(null, viewType as ViewType)}
          >
            {views[viewType as ViewType]}
          </button>
        ))}
        <div className={styles.stretch}></div>
        <button
          onClick={addNewInput}
          className={`${styles.panelHeaderButton} ${styles.iconPanelHeaderButton}`}
        >
          <PlusIcon />
        </button>
        {/* <button onClick={changeToJSONInput} className={`${styles.panelHeaderButton} ${inputType === INPUT_TYPES.json ? styles.panelHeaderButtonSelected : ''}`}>JSON</button>
        <button onClick={changeToXMLInput} className={`${styles.panelHeaderButton} ${inputType === INPUT_TYPES.xml ? styles.panelHeaderButtonSelected : ''}`}>XML</button> */}
      </div>
      {!selectedInputFile && view === "inputs" && (
        <div className={styles.inputItemsList}>
          {inputFiles.map((inputFile, index) => {
            return (
              <div
                className={styles.inputItem}
                onClick={setSelectedInputFileIndex.bind(null, index)}
              >
                {inputFile.name}
              </div>
            );
          })}
        </div>
      )}
      {view === "functions" && (
        <div className={styles.inputItemsList}>
          <div className={styles.functionsListHeader}>
            Sample function list
          </div>
          {functionList.map((fn) => (
            <div className={styles.inputItem} key={fn.name}>
              {fn.name}
            </div>
          ))}
        </div>
      )}
      {selectedInputFile && (
        <>
          <div className={styles.panelHeader}>
            <button
              onClick={closeSelectedInputFile}
              className={`${styles.panelHeaderButton} ${styles.iconPanelHeaderButton}`}
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
