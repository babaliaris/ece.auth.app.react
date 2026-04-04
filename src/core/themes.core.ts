import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";

export type ThemeModeType = "LIGHT" | "DARK";

const light_theme: Theme = createTheme(
{
  palette:
  {
    mode: "light"
  }
});

const dark_theme: Theme = createTheme(
{
  palette:
  {
    mode: "dark"
  }
});


/**
  * Get the a theme object.
  *
  * @param mode Selects the theme object to be returned.
  *
  * @returns An MUI Theme object.
  */
export function eceGetTheme(mode: ThemeModeType)
{
  switch(mode)
  {
    case "LIGHT": return light_theme;
    case "DARK" : return dark_theme;
    default     : return light_theme;
  }
}

