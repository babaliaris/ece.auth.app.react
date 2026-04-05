import { useEffect } from "react";
import { Outlet } from "react-router";
import { EceAppProvider } from "@/core/contexts/app_context/app.context";
import { ece_api } from "@/core/services/api/api.service";
import { ece_logger } from "@/core/logger.core";
import { useEceAuthStore } from "@/core/zustand-state";

function RootRoute()
{
  const {setAuth, clearAuth, setInitialized} = useEceAuthStore();

  // Intitialize the authentication state in the background.
  useEffect(()=>
  {
    const initAuthState = async ()=>
    {
      // Check if a login session already exists.
      const me_result = await ece_api.userMe();

      // Login session exists.
      if (me_result.success && me_result.data)
      {
        setAuth(
        {
          m_uuid  : me_result.data.m_uuid,
          m_email : me_result.data.m_email,
          m_role  : me_result.data.m_role
        });

        ece_logger.info(
          `[RootRoute] User session restored.`,
          me_result.data
        );
      }

      // else clear the state.
      else
      {
        ece_logger.warn(
          `[RootRoute] User session FAILED to be restored.`,
          me_result.error
        );
        clearAuth();
      }

      setInitialized(true);
    };

    initAuthState();
  }, []);

  return (
    // Contains the Theme Provider as well.
    <EceAppProvider>
      
      {/*Render the rest of the APP*/}
      <Outlet/>

    </EceAppProvider>
  );
}

export default RootRoute;
