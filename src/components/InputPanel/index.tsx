import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import InputContext from "../../contexts/InputContext";
import { GREL } from "@comake/rmlmapper-js";
import styles from "../../css/RMLMappingEditor.module.scss";
import CodeEditor from "../CodeEditor";
import { ReactComponent as PlusIcon } from "../../images/plus.svg";
import { ReactComponent as DownArrow } from "../../images/down-arrow.svg";
import ViewButton from "./ViewButton";
import { ViewType } from "../../util/TypeUtil";
import InputItem from "./InputItem";
import { INPUT_TYPES, functions } from "../../util/Constants";

const views: Record<ViewType, string> = {
  [ViewType.INPUTS]: "Input Files",
  [ViewType.FUNCTIONS]: "Functions",
};
// type ViewType = keyof typeof views;

export interface InputPanelProps {
  addNewInput: () => void;
}

function InputPanel({ addNewInput }: InputPanelProps) {
  const [view, setView] = useState<ViewType>(ViewType.INPUTS);
  const { inputFiles, setInputFiles } = useContext(InputContext);
  const [selectedInputFileIndex, setSelectedInputFileIndex] =
    useState<number>();
  console.log({ GREL });
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
          <ViewButton
            key={viewType}
            name={viewType as ViewType}
            onClick={changeView}
            isSelected={view === viewType}
          >
            {views[viewType as ViewType]}
          </ViewButton>
        ))}
        <div className={styles.stretch}></div>
        <button
          onClick={addNewInput}
          className={`${styles.headerButton} ${styles.iconHeaderButton}`}
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
              <InputItem
                key={index}
                index={index}
                onClick={setSelectedInputFileIndex}
              >
                {inputFile.name}
              </InputItem>
            );
          })}
        </div>
      )}
      {view === "functions" && (
        <div className={styles.inputItemsList}>
          <div className={styles.functionsListHeader}>Sample function list</div>
          {Object.keys(functions).map((fn) => {
            const fnKey = fn as keyof typeof functions;
            const func = functions[fnKey];
            const props = Object.keys(func.params);
            const propExp = props.map(
              (prop) =>
                `${
                  func.params[prop as keyof typeof func.params].type ?? ""
                } - ${
                  func.params[prop as keyof typeof func.params].comment ?? ""
                }`
            );
            return (
              <div className={styles.inputItem} key={fnKey}>
                {func.name}
                <br />
                {propExp.map((item) => (
                  <React.Fragment key={item}>
                    <span className={styles.inputItemComment} title={item}>
                      {item}
                    </span>
                    <br />
                  </React.Fragment>
                ))}
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
