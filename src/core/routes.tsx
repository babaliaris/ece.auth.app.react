import { createBrowserRouter } from "react-router";
import GlobalErrorCmp from "@/core/components/GlobalErrorCmp";

import RootRoute from "@/Root/RootRoute";
import EceAuthGuard from "./components/EceAuthGuardCmp";
import LoginRoute from "@/Root/Login/LoginRoute";
import RegisterRoute from "@/Root/Register/RegisterRoute";
import AdminRoute from "@/Root/Admin/AdminRoute";
import SubjectsRoute from "@/Root/Admin/Exams/SubjectsRoute";
import ExamsRoute from "@/Root/Admin/Exams/ExamsRoute";
import ExaminationsRoute from "@/Root/Admin/Exams/ExaminationsRoute";

export const ECE_ROUTE_PATHS =
{
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
  ADMIN_SUBJECTS: "/admin/subjects",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_EXAMINATIONS: "/admin/examinations"
} as const;




export function eceGetRouter()
{
  // Replace double slashes // if they exist in the middle.
  const base_name = import.meta.env.VITE_ROUTER_BASE || '';
  const base_path = `/${base_name}/`.replace(/\/+/g, '/');

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
        },

        {
          element: <EceAuthGuard required_role="ADMIN"/>,
          children:
          [
            {
              path: ECE_ROUTE_PATHS.ADMIN,
              element: <AdminRoute/>,
              children:
              [
                {
                  path: ECE_ROUTE_PATHS.ADMIN_SUBJECTS,
                  element: <SubjectsRoute/>
                },

                {
                  path: ECE_ROUTE_PATHS.ADMIN_EXAMS,
                  element: <ExamsRoute/>
                },

                {
                  path: ECE_ROUTE_PATHS.ADMIN_EXAMINATIONS,
                  element: <ExaminationsRoute/>
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  {
    basename: base_path
  });
}


