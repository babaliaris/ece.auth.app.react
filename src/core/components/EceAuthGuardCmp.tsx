import { Navigate, Outlet, useLocation } from "react-router";
import { ECE_ROUTE_PATHS } from "@/core/routes";
import { useEceAuthStore } from "@/core/zustand-state";
import { type ApiUserRoleType } from "../services/api/api.models";
import { ece_logger } from "../logger.core";

interface EceAuthGuardProps
{
  required_role?: ApiUserRoleType
}

function EceAuthGuard(
{
  required_role
}: EceAuthGuardProps)
{
  const location = useLocation();

  const {
    user,
    is_authenticated,
    is_initialized
  } = useEceAuthStore();

  // Check if the state is still Initializing.
  if (!is_initialized)
  {
    ece_logger.info(
      `[EceAuthGuard] Auth (ZUSTAND) state is Initializing...`
    );

    // TODO: Replace this with a spinner or something.
    return <div>Initializing The Application</div>; 
  }

  // Initialized and NOT logged in? 
  if (!is_authenticated)
  {
    ece_logger.warn(
      `[EceAuthGuard] User is not authenticated, redirecting to login...`
    );

    return (
      <Navigate
      to={ECE_ROUTE_PATHS.LOGIN}
      state={{ from: location }}
      replace
      />
    );
  }

  // Logged in but wrong role?
  if (required_role && user && user.m_role !== required_role)
  {
    ece_logger.warn(
      `[EceAuthGuard] User HAS NO access to this route, redirecting to root...`
    );

    return (
      <Navigate
      to={ECE_ROUTE_PATHS.ROOT}
      replace
      />
    );
  }

  ece_logger.info(
    `[EceAuthGuard] Guard check succeeded, proceeding rendering children...`
  );

  // Success! Render the child routes.
  return <Outlet />;
};

export default EceAuthGuard;

