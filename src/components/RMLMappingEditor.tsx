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
import InputContext, {
  DEFAULT_INPUT_FILE_BY_TYPE,
  INPUT_TYPES,
  InputFile,
} from "../contexts/InputContext";
import OutputContext from "../contexts/OutputContext";
import * as RMLMapper from "@comake/rmlmapper-js";
import NewInputModal from "./NewInputModal";

const BASE_PANEL_WIDTH = 400;
const RUN_MAPPING_TIMEOUT_DURATION = 500;

const defaultMapping = {
  "@context": {
    rr: "http://www.w3.org/ns/r2rml#",
    rml: "http://semweb.mmlab.be/ns/rml#",
  },
  "@type": "http://www.w3.org/ns/r2rml#TriplesMap",
  "rml:logicalSource": {
    "@type": "rml:LogicalSource",
    "rml:iterator": "$",
    "rml:referenceFormulation": "http://semweb.mmlab.be/ns/ql#JSONPath",
    "rml:source": "input.json",
  },
  "rr:subject": "https://example.com/mappingSubject",
  "rr:predicateObjectMap": [],
};

const defaultInputFiles = [
  {
    name: "input.json",
    contents: DEFAULT_INPUT_FILE_BY_TYPE[INPUT_TYPES.json],
  },
];

export function RMLMappingEditor() {
  const [theme, setTheme] = useState(THEMES.dark);
  const [mapping, setMapping] = useState<NodeObject>(defaultMapping);
  const [mappingError, setMappingError] = useState<Error>();
  const [inputFiles, setInputFiles] = useState<InputFile[]>(defaultInputFiles);
  const [output, setOutput] = useState<NodeObject[]>();
  const runMappingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [addingNewInput, setAddingNewInput] = useState(false);
  const [collapsed, setCollapsed] = useState<string[]>([]);

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
  const collapseItem = (panelToCollapse: PanelType) => {
    setCollapsed((curr) => [...curr, panelToCollapse]);
  };

  const {
    panelOrder,
    Panels,
  }: { panelOrder: PanelType[]; Panels: Record<PanelType, ReactNode> } =
    useMemo(
      () => ({
        panelOrder: ["input", "editor", "output"] as PanelType[],
        Panels: {
          input: (
            <InputPanel addNewInput={addNewInput} collapse={collapseItem} />
          ),
          editor: <EditorPanel />,
          output: <OutputPanel collapse={collapseItem} />,
        },
      }),
      [addNewInput]
    );

  const content = useMemo(
    () =>
      panelOrder.map((key) => {
        if (collapsed.includes(key)) {
          return (<div></div>) as ReactNode;
        }
        return Panels[key] as ReactNode;
      }) as unknown as FixedLengthArray<ReactNode, 3>,
    [collapsed, Panels, panelOrder]
  );

  const unCollapse = useCallback(
    (item: string) => {
      setCollapsed((curr) => curr.filter((panelName) => panelName !== item));
    },
    [setCollapsed]
  );
  const collapsedIndices = useMemo(() => {
    const resIndices: number[] = [];
    panelOrder.forEach((item, index) => {
      if (collapsed.includes(item)) resIndices.push(index);
    });
    return resIndices;
  }, [collapsed, panelOrder]);

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
              <Header collapsedItems={collapsed} unCollapse={unCollapse} />
              <DraggableViewContainer
                defaultViewDimensions={defaultBodyWidths}
                viewContent={content}
                additionalClasses={[styles.body]}
                collapsedIndices={collapsedIndices}
              />
              {addingNewInput && <NewInputModal close={closeNewInputModal} />}
            </div>
          </OutputContext.Provider>
        </InputContext.Provider>
      </MappingContext.Provider>
    </ThemeContext.Provider>
  );
}
