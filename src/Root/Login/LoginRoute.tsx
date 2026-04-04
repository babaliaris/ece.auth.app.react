import { useCallback } from "react";
import LoginCmp, { type LoginDataType } from "./LoginUI.tsx";

function LoginRoute()
{
  const onLogin = useCallback(async (value: LoginDataType)=>
  {
    console.log(value.email);
  }, []);

  return (
    <LoginCmp
    onLoginFormSubmit={onLogin}
    />
  );
}

export default LoginRoute;

