import { useCallback } from "react";
import RegisterUI, { type RegisterDataType } from "./RegisterUI.tsx";
import { ece_api } from "@/core/services/api/api.service.ts";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service.ts";
import { ece_logger } from "@/core/logger.core.ts";

function RegisterRoute()
{
  const onRegister = useCallback(async (value: RegisterDataType)=>
  {
    const result = await ece_api.userPost(
    {
      m_email: value.email,
      m_pass: value.password
    });

    if (result.success && result.data)
    {
      ece_logger.info("UserPosted: ", result.data);
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

