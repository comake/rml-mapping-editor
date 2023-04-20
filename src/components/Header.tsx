import ThemeToggle from './ThemeToggle';
import styles from '../css/RMLMappingEditor.module.scss';

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>RML Mapping Editor</div>
      <ThemeToggle />
    </div>
  )
}

export default Header;