import { ReactComponent as PanelToggle } from "../images/panel-toggle.svg";
import styles from '../css/RMLMappingEditor.module.scss';
import { useCallback, useMemo } from 'react';
import { PanelType } from '../util/TypeUtil';

interface TogglePanelButtonProps {
  panelName: PanelType;
  toggle: (panelName: PanelType) => void;
}
function TogglePanelButton({ panelName, toggle }: TogglePanelButtonProps) {
  
  const handleToggle = useCallback(
    () => toggle(panelName),
    [panelName, toggle]
  );

  const classes = useMemo(
    () => ([
        styles.headerButton,
        styles.iconHeaderButton,
        panelName === 'input' 
          ? styles.collapsePanelButtonLeft 
          : styles.collapsePanelButtonRight,
      ].join(' ')),
    [panelName]
  );

  return (
    <button onClick={handleToggle} className={classes}>
      <PanelToggle />
    </button>
  )
}

export default TogglePanelButton;