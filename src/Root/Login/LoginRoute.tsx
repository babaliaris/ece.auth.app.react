import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import LoginUI, { type LoginDataType } from "./LoginUI.tsx";
import { ECE_ROUTE_PATHS } from "@/core/routes.tsx";
import { ece_api } from "@/core/services/api/api.service.ts";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service.ts";
import { ece_logger } from "@/core/logger.core.ts";
import { useEceAuthStore } from "@/core/zustand-state.ts";

function LoginRoute()
{
  const navigate = useNavigate();

  const {
    setAuth,
    setInitialized,
    is_authenticated
  } = useEceAuthStore();

  useEffect(() =>
  {
    if (is_authenticated)
    {
      // TODO: Change this to take them to the STUDENT or ADMIN home page.
      navigate(ECE_ROUTE_PATHS.ROOT, { replace: true });
    }
  }, [is_authenticated, navigate]);

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
      const err = eceApiGetErrorInfo(result);

      alert(err.dialog_body);
    }
  }, []);

  return (
    <LoginUI
    onLoginFormSubmit={onLogin}
    />
  );
}

export default LoginRoute;

