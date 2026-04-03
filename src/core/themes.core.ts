import { createTheme } from "@mui/material";

export function eceGetLightTheme()
{
  return createTheme(
  {
    palette:
    {
      mode: "light"
    }
  });
}




export function eceGetDarkTheme()
{
  return createTheme(
  {
    palette:
    {
      mode: "dark"
    }
  });
}

