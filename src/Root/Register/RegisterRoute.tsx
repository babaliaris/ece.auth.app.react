import { useCallback } from "react";
import { useNavigate } from "react-router";
import RegisterUI, { type RegisterDataType } from "./RegisterUI.tsx";
import { ece_api } from "@/core/services/api/api.service.ts";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service.ts";
import { ece_logger } from "@/core/logger.core.ts";
import { ECE_ROUTE_PATHS } from "@/core/routes.tsx";

function RegisterRoute()
{
  const navigate = useNavigate();

  const onRegister = useCallback(async (value: RegisterDataType)=>
  {
    //TODO: Use a loading spinner.
    const result = await ece_api.userPost(
    {
      m_email: value.email,
      m_pass: value.password
    });

    if (result.success && result.data)
    {
      ece_logger.info("UserPosted: ", result.data);
      navigate(ECE_ROUTE_PATHS.LOGIN);
    }

    else
    {
      const err = eceApiGetErrorInfo(result);
      alert(err.dialog_body);
    }
  }, []);

  return (
    <RegisterUI
    onRegisterFormSubmit={onRegister}
    />
  );
}

export default RegisterRoute;

