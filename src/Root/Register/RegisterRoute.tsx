import { useCallback } from "react";
import RegisterUI, { type RegisterDataType } from "./RegisterUI.tsx";

function RegisterRoute()
{
  const onRegister = useCallback(async (value: RegisterDataType)=>
  {
    console.log(value.email);
  }, []);

  return (
    <RegisterUI
    onRegisterFormSubmit={onRegister}
    />
  );
}

export default RegisterRoute;

