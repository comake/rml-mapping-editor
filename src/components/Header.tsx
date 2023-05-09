import ThemeToggle from './ThemeToggle';
import styles from '../css/RMLMappingEditor.module.scss';
import { ReactElement } from 'react';
interface HeaderProps {
  collapsedItems: Array<string | { name: string; icon: ReactElement }>;
  unCollapse: (item: string) => void;
}

function Header({ collapsedItems, unCollapse }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>RML Mapping Editor</div>
      {collapsedItems.map((item) => {
        const name = typeof item === 'string' ? item : item.name;
        const icon = typeof item === 'string' ? null : item.icon;
        return (
          <button
            key={name}
            onClick={unCollapse.bind(null, name)}
            className={`${styles.panelHeaderButton}`}
          >
            {icon ?? `${name[0].toUpperCase()}${name.slice(1)} Panel`}
          </button>
        );
      })}
      <ThemeToggle />
    </div>
  );
}

export default Header;
