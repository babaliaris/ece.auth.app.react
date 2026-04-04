import { createBrowserRouter } from "react-router";
import GlobalErrorCmp from "@/core/components/GlobalErrorCmp";

import RootRoute from "@/Root/RootRoute";
import LoginRoute from "@/Root/Login/LoginRoute";

export const ECE_ROUTE_PATHS =
{
  ROOT: "/",
  LOGIN: "/login"
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
        }
      ]
    }
  ]);
}


