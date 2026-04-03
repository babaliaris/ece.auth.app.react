import { createBrowserRouter } from "react-router";
import GlobalErrorCmp from "./components/GlobalErrorCmp";
import RootRoute from "@/Root/RootRoute";

export const ECE_ROUTE_PATHS =
{
  ROOT: "/"
} as const;




export function eceGetRouter()
{
  return createBrowserRouter(
  [
    {
      path        : ECE_ROUTE_PATHS.ROOT,
      element     : <RootRoute/>,
      errorElement: <GlobalErrorCmp/>
    }
  ]);
}


