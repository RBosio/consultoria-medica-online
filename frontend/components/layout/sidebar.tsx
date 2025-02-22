import React from "react";
import Image from "next/image";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { PiGearSix } from "react-icons/pi";
import { FaFileMedical, FaUser, FaUserDoctor, FaVideo } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { Auth } from "../../types";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Avatar from "../avatar";
import { TbReportAnalytics } from "react-icons/tb";
import { FaQuestionCircle } from "react-icons/fa";

interface SidebarProps {
  auth: Auth;
  setSidebarOpened: any;
  sidebarOpened: boolean;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const theme = useTheme();
  const router = useRouter();

  const routes = {
    top: [
      {
        name: "Dashboard",
        path: "/",
        icon: <MdSpaceDashboard />,
        hide: false,
      },
      {
        name: "Profesionales",
        path: "/doctors",
        icon: <FaUserDoctor />,
        hide: props.auth.role === "doctor",
      },
      {
        name: "Mis reuniones",
        path: `/meetings`,
        icon: <FaVideo />,
        hide: false,
      },
      {
        name: "Mi historia clinica",
        path: `/medical-record`,
        icon: <FaFileMedical />,
        hide: props.auth.role === "doctor",
      },
      {
        name: "Perfil",
        path: `/profile`,
        icon: <FaUser />,
      },
      {
        name: "Configuración",
        path: "/config",
        icon: <PiGearSix />,
        hide: props.auth.role !== "doctor",
      },
    ],
    bottom: [
      {
        name: "¿Eres un profesional médico?",
        path: "/register_doctor",
        icon: <FaUserDoctor />,
        hide: props.auth.role !== "user",
      },
      {
        name: "Panel administración",
        path: "/admin",
        icon: <MdOutlineAdminPanelSettings />,
        hide: props.auth.role !== "admin",
      },
      {
        name: "Análisis",
        path: "/analytics",
        icon: <TbReportAnalytics />,
        hide: props.auth.role === 'user',
      },
      {
        name: "Preguntas frecuentes",
        path: "/faq",
        icon: <FaQuestionCircle/>,
        hide: false,
      },
      {
        name: "Cerrar sesión",
        path: "/logout",
        icon: <GrLogout />,
        hide: false,
      },
    ],
  };

  return (
    <section
      className={`
        absolute transition-[left] 
        duration-300 ease-in
        top-0 ${props.sidebarOpened ? "left-0" : "left-[-48rem]"} 
        w-full md:w-60
        shrink-0 bg-white h-full 
        z-30 shadow-lg md:static`}
    >
      <div className="h-20 flex items-center justify-center shadow-md p-4 md:p-0">
        <Image src="/logo.png" width={200} height={200} alt="Logo HealthTech" />
        <IconButton
          onClick={() => props.setSidebarOpened(false)}
          className="ml-auto md:hidden"
          color="primary"
        >
          <IoIosCloseCircleOutline
            color={theme.palette.primary.main}
            size="35"
          />
        </IconButton>
      </div>
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
            {routes[section]
              .filter((r) => !r.hide)
              .map((route) => {
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
                        background: selected
                          ? theme.palette.primary.main
                          : null,
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

export default Sidebar;
