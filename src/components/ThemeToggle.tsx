import { useCallback, useContext } from 'react';
import ThemeContext, { THEMES } from '../contexts/ThemeContext';
import { ReactComponent as SunIcon } from '../images/sun.svg';
import { ReactComponent as MoonIcon } from '../images/moon.svg';
import styles from '../css/RMLMappingEditor.module.scss';


function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = useCallback(() => {
    if (theme === THEMES.dark) {
      setTheme(THEMES.light);
    } else {
      setTheme(THEMES.dark);
    }
  }, [setTheme, theme]);
  
  return (
    <button onClick={toggleTheme} className={`${styles.headerButton} ${styles.iconHeaderButton} ${styles.themeToggle}`}>
      { theme === THEMES.dark ? <SunIcon /> : <MoonIcon /> }
    </button>
  )
}

export default ThemeToggle;