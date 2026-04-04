import { createContext } from "react";
import { type ThemeModeType } from "@/core/themes.core";

export type EceAppContextType =
{
  theme_mode  : ThemeModeType;
  toggleTheme : () => void;
  setThemeMode: (mode: ThemeModeType) => void;
}

export const EceAppContext = createContext<EceAppContextType | undefined>(undefined);

