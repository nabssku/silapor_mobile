import React, { createContext, useContext, useState, useMemo } from "react";
import { useColorScheme } from "react-native";
import { ThemeColors, lightTheme, darkTheme, ThemeMode } from "../constants/theme";
import { createGlobalStyles } from "../constants/styles";

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  styles: ReturnType<typeof createGlobalStyles>;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const defaultStyles = createGlobalStyles(lightTheme);

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: "light",
  isDark: false,
  styles: defaultStyles,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const isDark = useMemo(() => {
    if (themeMode === "system") {
      return systemScheme === "dark";
    }
    return themeMode === "dark";
  }, [themeMode, systemScheme]);

  const theme = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  const styles = useMemo(() => {
    return createGlobalStyles(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      styles,
      setThemeMode,
      toggleTheme,
    }),
    [theme, themeMode, isDark, styles]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
