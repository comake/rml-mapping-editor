import { useContext, useMemo } from "react";
import OutputContext from "../contexts/OutputContext";
import styles from "../css/RMLMappingEditor.module.scss";
import CodeEditor from "./CodeEditor";
import { ReactComponent as DownArrow } from "../images/down-arrow.svg";
import { PanelType } from "../util/TypeUtil";

function OutputPanel({ collapse }: { collapse: (item: PanelType) => void }) {
  const { output } = useContext(OutputContext);
  const stringOutput = useMemo(
    () => JSON.stringify(output, undefined, 2),
    [output]
  );
  return (
    <div className={styles.outputPanel}>
      <div className={styles.panelHeader}>
        <button
          onClick={collapse.bind(null, "output")}
          className={`${styles.panelHeaderButton} ${styles.iconPanelHeaderButton} ${styles.collapsePanelButtonRight}`}
        >
          <DownArrow />
        </button>
      </div>
      <CodeEditor
        key={stringOutput}
        code={stringOutput}
        locked
        disableLinting
        classes={styles.mappingEditorCodeView}
      />
    </div>
  );
}

export default OutputPanel;
