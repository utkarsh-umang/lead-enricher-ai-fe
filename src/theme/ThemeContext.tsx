import { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme, Theme } from './theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void; // Optional for future dark mode support
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme] = useState<Theme>(lightTheme);

  // Future: Add dark mode toggle functionality here
  // const toggleTheme = () => {
  //   setTheme(prevTheme => prevTheme === lightTheme ? darkTheme : lightTheme);
  // };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};



