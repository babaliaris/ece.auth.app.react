import { useMemo } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { ECE_ROUTE_PATHS } from "@/core/routes";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import EceSidebarCmp from "@/core/components/EceSidebarCmp";

import {
  Book as BookIcon,
  Event as EventIcon,
  CalendarMonth as CalendarMonthIcon
} from "@mui/icons-material";


function AdminRoute()
{
  const navigate = useNavigate();
  const location = useLocation();
  const {t}      = useTranslation();

  const admin_items = useMemo(()=>(
  [
    {
      icon    : <BookIcon />,
      title   : t('admin_sidebar.subjects.title'),
      tip     : t('admin_sidebar.subjects.tip'),
      onClick : () => navigate(ECE_ROUTE_PATHS.ADMIN_SUBJECTS, {replace: true}),
      active  : location.pathname === ECE_ROUTE_PATHS.ADMIN_SUBJECTS
    },
    {
      icon    : <EventIcon />,
      title   : t('admin_sidebar.exams.title'),
      tip     : t('admin_sidebar.exams.tip'),
      onClick : () => navigate(ECE_ROUTE_PATHS.ADMIN_EXAMS, {replace: true}),
      active  : location.pathname === ECE_ROUTE_PATHS.ADMIN_EXAMS
    },
    {
      icon    : <CalendarMonthIcon />,
      title   : t('admin_sidebar.examinations.title'),
      tip     : t('admin_sidebar.examinations.tip'),
      onClick : () => navigate(ECE_ROUTE_PATHS.ADMIN_EXAMINATIONS, {replace: true}),
      active  : location.pathname === ECE_ROUTE_PATHS.ADMIN_EXAMINATIONS
    }
  ]), [t, location.pathname, navigate]);

  return (
    <Box
    sx=
    {{
      display: "flex", height: "100vh"
    }}>

      <EceSidebarCmp
      item_data={admin_items}
      />

      <Box
      component="main"
      sx=
      {{
        flexGrow: 1, p: 3
      }}>
        <Outlet />

      </Box>

    </Box>
  );
}

export default AdminRoute;

