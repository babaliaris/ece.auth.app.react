import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import LoginUI, { type LoginDataType } from "./LoginUI.tsx";
import { ECE_ROUTE_PATHS } from "@/core/routes.tsx";
import { ece_api } from "@/core/services/api/api.service.ts";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service.ts";
import { ece_logger } from "@/core/logger.core.ts";
import { useEceAuthStore } from "@/core/zustand-state.ts";
import { useTranslation } from "react-i18next";

function LoginRoute()
{
  const navigate  = useNavigate();
  const search    = useSearchParams();
  const {t}       = useTranslation();

  const {
    setAuth,
    setInitialized,
    is_authenticated
  } = useEceAuthStore();

  useEffect(() =>
  {
    const unauthorized_query  = search[0].get("unauthorized");
    const return_path_query   = search[0].get("return_path");

    if (is_authenticated)
    {
      if (unauthorized_query === "true" && return_path_query)
      {
        // The caller SHOULD make sure return_path is encoded
        // and a correct ABSOLUTE path for React Router.
        navigate(return_path_query);
      }

      else
      {
        // TODO: Change this to take them to the STUDENT or ADMIN home page.
        navigate(ECE_ROUTE_PATHS.ROOT, { replace: true });
      }
    }

  }, [is_authenticated, navigate, search]);

  const onLogin = useCallback(async (value: LoginDataType)=>
  {
    // TODO: Use a loading spinner.
    const result = await ece_api.userLogin(
    {
      m_email : value.email,
      m_pass  : value.password
    });

    if (result.success && result.data)
    {
      ece_logger.info('UserLogin: ', result.data);

      // This will trigger a re-render, so the USE effect
      // will handle the rest.
      setAuth(
      {
        m_uuid  : result.data.body.m_uuid,
        m_email : result.data.body.m_email,
        m_role  : result.data.body.m_role
      });

      setInitialized(true);
    }

    else
    {
      // TODO: Replace the alerts with better UI.
      if (result.status === 401)
      {
        alert(t('login.failure.body'));
      }

      else
      {
        const err = eceApiGetErrorInfo(result);
        alert(err.dialog_body);
      }
    }
  }, [setAuth, setInitialized, t]);

  return (
    <LoginUI
    onLoginFormSubmit={onLogin}
    />
  );
}

export default LoginRoute;

