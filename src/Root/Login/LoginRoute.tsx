import { useCallback } from "react";
import LoginUI, { type LoginDataType } from "./LoginUI.tsx";
import { ece_api } from "@/core/services/api/api.service.ts";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service.ts";
import { ece_logger } from "@/core/logger.core.ts";

function LoginRoute()
{
  const onLogin = useCallback(async (value: LoginDataType)=>
  {
    const result = await ece_api.userLogin(
    {
      m_email: value.email,
      m_pass: value.password
    });

    if (result.success && result.data)
    {
      ece_logger.info('UserLogin: ', result.data);
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

