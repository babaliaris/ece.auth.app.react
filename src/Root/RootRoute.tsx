import { useTranslation } from "react-i18next";

function RootRoute() {

  const { t } = useTranslation();

  return (
    <>
      <div
      style={
        {
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto"
        }
      }
      >
        Hello {t('APP_TITLE')}
      </div>
    </>
  )
}

export default RootRoute;
