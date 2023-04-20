import { createContext } from 'react';

export const THEMES = {
  dark: 'dark',
  light: 'light'
}

const ThemeContext = createContext({ 
  theme: THEMES.dark, 
  setTheme: (theme: string) => {},
});

export default ThemeContext;