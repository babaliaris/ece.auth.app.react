import { useTranslation } from "react-i18next";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { eceGetLightTheme, eceGetDarkTheme } from "@/core/themes.core";
import { ECE_APP_CONFIG } from "@/core/literals.core";

function RootRoute()
{

  const { t } = useTranslation();

  return (
    <ThemeProvider
      theme=
      {
        ECE_APP_CONFIG.USE_LIGHT_AS_DEFAULT_THEME
          ? eceGetLightTheme()
          : eceGetDarkTheme()
      }
    >
      <CssBaseline/>

      <div
      style={
        {
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center"
        }
      }
      >
        Hello {t('app_title')}
      </div>
    </ThemeProvider>
  );
}

export default RootRoute;
