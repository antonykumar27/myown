import {
  Home,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  FileText,
  Settings,
} from "lucide-react";

import { useAuth } from "../common/AuthContext";

export const getSidebarLinksMobiles = () => {
  const { user } = useAuth();
  const role = user?.user?.role;

  const sidebarLinks = [
    {
      icon: Home,
      route: "/adminSelf",
      label: "Admin DashBoard",
      show: true,
    },
    {
      icon: Home,
      route: "/adminSelf/home",
      label: "Home",
      show: role === "student",
    },
    {
      icon: LayoutDashboard,
      route: "/adminSelf/dashboard",
      label: "Dashboard",
      show: true,
    },
    {
      icon: FolderKanban,
      route: "/adminSelf/projects",
      label: "Projects",
      show: true,
    },
    {
      icon: CheckSquare,
      route: "/adminSelf/tasks",
      label: "Tasks",
      show: true,
    },
    {
      icon: Calendar,
      route: "/adminSelf/calendar",
      label: "Calendar",
      show: true,
    },
    {
      icon: FileText,
      route: "/adminSelf/notes",
      label: "Notes",
      show: true,
    },
    {
      icon: Settings,
      route: "/adminSelf/settings",
      label: "Settings",
      show: true,
    },
  ];

  return sidebarLinks.filter((link) => link.show);
};
