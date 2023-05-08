import ThemeToggle from "./ThemeToggle";
import styles from "../css/RMLMappingEditor.module.scss";

function Header({
  collapsedItems,
  unCollapse,
}: {
  collapsedItems: string[];
  unCollapse: (item: string) => void;
}) {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>RML Mapping Editor</div>
      {collapsedItems.map((item) => (
        <button
          key={item}
          onClick={unCollapse.bind(null, item)}
          className={`${styles.panelHeaderButton}`}
        >
          {item[0].toUpperCase()}
          {item.slice(1)} Panel
        </button>
      ))}
      <ThemeToggle />
    </div>
  );
}

export default Header;
