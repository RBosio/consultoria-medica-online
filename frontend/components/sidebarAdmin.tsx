import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { FaHandshake, FaKitMedical, FaThumbsUp, FaUserDoctor } from "react-icons/fa6";
import Avatar from "./avatar";
import Link from "next/link";
import { Auth } from "../../shared/types";

interface SidebarAdminProps {
  auth: Auth;
  setSidebarOpened: any;
  sidebarOpened: boolean;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = (props) => {
  const theme = useTheme();
  const router = useRouter();

  const routes = {
    top: [
      {
        name: "Profesionales",
        path: "/admin/doctors",
        icon: <FaUserDoctor />,
      },
      {
        name: "Beneficios",
        path: "/admin/benefits",
        icon: <FaThumbsUp />,
      },
      {
        name: "Planes",
        path: "/admin/plans",
        icon: <FaHandshake />,
      },
      {
        name: "Obras sociales",
        path: "/admin/health-insurances",
        icon: <FaKitMedical />,
      },
      {
        name: "Especialidades",
        path: "/admin/specialities",
        icon: <FaUserDoctor />,
      },
    ],
    bottom: [],
  };

  return (
    <section
      className={`
        absolute transition-[left] 
        duration-300 ease-in
        top-0 ${props.sidebarOpened ? "left-0" : "left-[-48rem]"} 
        w-full md:w-60
        shrink-0 bg-white 
        z-30 shadow-lg md:static
        ml-12 rounded-lg
        h-[calc(100%-20rem)]`}
    >
      <div className="flex flex-col h-[calc(100%-5rem)] items-center md:justify-between">
        <Avatar
          rootClassName="md:hidden my-6"
          size={56}
          labelProps={{ position: "bottom" }}
          name={props.auth.name}
          surname={props.auth.surname}
          photo={props.auth.photo}
        />
        {(Object.keys(routes) as ("top" | "bottom")[]).map((section) => (
          <List
            key={section}
            sx={{ width: "100%", padding: "0 0" }}
            component="nav"
          >
            {routes[section].map((route) => {
              const isBasePath =
                router.pathname === route.path && route.path === "/";
              const isSubPath =
                router.pathname.startsWith(route.path) &&
                router.pathname !== "/" &&
                route.path !== "/";

              let selected = isBasePath || isSubPath;

              return (
                <Link key={route.name} href={route.path}>
                  <ListItemButton
                    sx={{
                      background: selected ? theme.palette.primary.main : null,
                      color: selected
                        ? "#ffffff"
                        : theme.palette.secondary.main,
                      "&:hover": {
                        background: selected
                          ? theme.palette.primary.main
                          : null,
                      },
                      "& .MuiTypography-root": {
                        textAlign: "center",
                      },
                      "& .MuiListItemIcon-root": {
                        margin: 0,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        marginRight: 2,
                        fontSize: "1.3em",
                        color: selected
                          ? "#ffffff"
                          : theme.palette.primary.main,
                      }}
                    >
                      {route.icon}
                    </ListItemIcon>
                    <ListItemText primary={route.name} />
                  </ListItemButton>
                </Link>
              );
            })}
          </List>
        ))}
      </div>
    </section>
  );
};

export default SidebarAdmin;
