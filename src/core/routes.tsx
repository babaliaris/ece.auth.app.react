import { createBrowserRouter } from "react-router";
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
      path    : ECE_ROUTE_PATHS.ROOT,
      element : <RootRoute/>
    }
  ]);
}


