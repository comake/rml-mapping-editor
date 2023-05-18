import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ThemeContext, { THEMES } from "../contexts/ThemeContext";
import styles from "../css/RMLMappingEditor.module.scss";
import { FixedLengthArray, PanelType } from "../util/TypeUtil";
import DraggableViewContainer from "./DraggableViewContainer";
import EditorPanel from "./EditorPanel";
import Header from "./Header";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";
import type { NodeObject } from "jsonld";
import MappingContext from "../contexts/MappingContext";
import InputContext, { InputFile } from "../contexts/InputContext";
import OutputContext from "../contexts/OutputContext";
import * as RMLMapper from "@comake/rmlmapper-js";
import NewInputModal from "./NewInputModal";
import { DEFAULT_INPUT_FILES, DEFAULT_MAPPING, PANEL_ORDER } from '../util/Constants';

const BASE_PANEL_WIDTH = 400;
const RUN_MAPPING_TIMEOUT_DURATION = 500;

export function RMLMappingEditor() {
  const [theme, setTheme] = useState(THEMES.dark);
  const [mapping, setMapping] = useState<NodeObject>(DEFAULT_MAPPING);
  const [mappingError, setMappingError] = useState<Error>();
  const [inputFiles, setInputFiles] = useState<InputFile[]>(DEFAULT_INPUT_FILES);
  const [output, setOutput] = useState<NodeObject[]>();
  const runMappingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [addingNewInput, setAddingNewInput] = useState(false);
  const [collapsed, setCollapsed] = useState<PanelType[]>([]);

  const themeContext = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  const inputContext = useMemo(
    () => ({ inputFiles, setInputFiles }),
    [inputFiles, setInputFiles]
  );

  const outputContext = useMemo(
    () => ({ output, setOutput }),
    [output, setOutput]
  );

  const mappingContext = useMemo(
    () => ({ mapping, setMapping, mappingError, setMappingError }),
    [mapping, setMapping, mappingError, setMappingError]
  );

  const defaultBodyWidths = useMemo(
    () =>
      [BASE_PANEL_WIDTH, undefined, BASE_PANEL_WIDTH] as FixedLengthArray<
        number | undefined,
        3
      >,
    []
  );

  const addNewInput = useCallback(() => setAddingNewInput(true), []);
  const closeNewInputModal = useCallback(() => setAddingNewInput(false), []);

  useEffect(() => {
    async function runMapping() {
      setMappingError(undefined);

      const inputFilesByName = inputFiles.reduce((obj, inputFile) => {
        return { ...obj, [inputFile.name]: inputFile.contents };
      }, {});

      try {
        const result = (await RMLMapper.parseJsonLd(
          mapping,
          inputFilesByName
        )) as NodeObject[];
        setOutput(result);
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          setMappingError(error);
        }
      }
    }

    if (runMappingTimeout.current) {
      clearTimeout(runMappingTimeout.current);
    }
    runMappingTimeout.current = setTimeout(
      runMapping,
      RUN_MAPPING_TIMEOUT_DURATION
    );
  }, [inputFiles, mapping]);

  const panels = useMemo<FixedLengthArray<ReactNode, 3>>(
    () => ([
      <InputPanel addNewInput={addNewInput} />,
      <EditorPanel />,
      <OutputPanel />,
    ]) as unknown as FixedLengthArray<ReactNode, 3>,
    [addNewInput]
  );

  const togglePanelCollapse = useCallback(
    (panelName: PanelType) => {
      setCollapsed((prevCollapsedPanels) => {
        if (prevCollapsedPanels.includes(panelName)) {
          return prevCollapsedPanels.filter((collapsedPanel) => collapsedPanel !== panelName)
        }
        return [...prevCollapsedPanels, panelName];
      });
    },
    [setCollapsed]
  );
  const collapsedIndicies = useMemo(() => {
    const resIndices: number[] = [];
    PANEL_ORDER.forEach((item, index) => {
      if (collapsed.includes(item)) resIndices.push(index);
    });
    return resIndices;
  }, [collapsed]);

  return (
    <ThemeContext.Provider value={themeContext}>
      <MappingContext.Provider value={mappingContext}>
        <InputContext.Provider value={inputContext}>
          <OutputContext.Provider value={outputContext}>
            <div
              className={
                theme === THEMES.dark
                  ? styles.rmlEditorDark
                  : styles.rmlEditorLight
              }
            >
              <Header collapsedItems={collapsed} togglePanelCollapse={togglePanelCollapse} />
              <DraggableViewContainer
                defaultViewDimensions={defaultBodyWidths}
                viewContent={panels}
                additionalClasses={[styles.body]}
                collapsedIndicies={collapsedIndicies}
              />
              {addingNewInput && <NewInputModal close={closeNewInputModal} />}
            </div>
          </OutputContext.Provider>
        </InputContext.Provider>
      </MappingContext.Provider>
    </ThemeContext.Provider>
  );
}
