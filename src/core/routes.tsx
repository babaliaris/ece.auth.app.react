import { createBrowserRouter } from "react-router";
import GlobalErrorCmp from "@/core/components/GlobalErrorCmp";

import RootRoute from "@/Root/RootRoute";
import LoginRoute from "@/Root/Login/LoginRoute";
import RegisterRoute from "@/Root/Register/RegisterRoute";

export const ECE_ROUTE_PATHS =
{
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register"
} as const;




export function eceGetRouter()
{
  return createBrowserRouter(
  [
    {
      path        : ECE_ROUTE_PATHS.ROOT,
      element     : <RootRoute/>,
      errorElement: <GlobalErrorCmp/>,
      children    :
      [
        {
          path    : ECE_ROUTE_PATHS.LOGIN,
          element : <LoginRoute/>
        },

        {
          path: ECE_ROUTE_PATHS.REGISTER,
          element: <RegisterRoute/>
        }
      ]
    }
  ]);
}


