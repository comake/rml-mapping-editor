import ThemeToggle from './ThemeToggle';
import styles from '../css/RMLMappingEditor.module.scss';
import { ReactElement } from 'react';
import { PanelType } from '../util/TypeUtil';
import TogglePanelButton from './TogglePanelButton';
import { PANELS } from '../util/Constants';

interface HeaderProps {
  collapsedItems: Array<string | { name: string; icon: ReactElement }>;
  togglePanelCollapse: (item: PanelType) => void;
}

function Header({ togglePanelCollapse }: HeaderProps) {
  return (
    <div className={styles.header}>
      <TogglePanelButton toggle={togglePanelCollapse} panelName={PANELS.input} />
      <div className={styles.logo}>RML Mapping Editor</div>
      <ThemeToggle />
      <TogglePanelButton toggle={togglePanelCollapse} panelName={PANELS.output} />
    </div>
  );
}

export default Header;
