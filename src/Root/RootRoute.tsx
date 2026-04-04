import { Outlet } from "react-router";
import { EceAppProvider } from "@/core/contexts/app_context/app.context";

function RootRoute()
{
  return (
    // Contains the Theme Provider as well.
    <EceAppProvider>
      
      {/*Render the rest of the APP*/}
      <Outlet/>

    </EceAppProvider>
  );
}

export default RootRoute;
