import { useCallback } from "react";
import LoginUI, { type LoginDataType } from "./LoginUI.tsx";

function LoginRoute()
{
  const onLogin = useCallback(async (value: LoginDataType)=>
  {
    console.log(value.email);
  }, []);

  return (
    <LoginUI
    onLoginFormSubmit={onLogin}
    />
  );
}

export default LoginRoute;

