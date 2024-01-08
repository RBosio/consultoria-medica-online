import React from "react";
import Image from "next/image";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { PiGearSix } from "react-icons/pi";
import { FaUserDoctor } from "react-icons/fa6"
import { GrLogout } from "react-icons/gr";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { useRef } from "react";
import { Auth } from "../../../shared/types";

interface SidebarProps {
    auth: Auth
}

const Sidebar: React.FC<SidebarProps> = (props) => {

    const theme = useTheme();
    const router = useRouter();
    const root = useRef<HTMLDivElement>(null);

    const routes = {
        top: [
            {
                name: "Dashboard",
                path: "/",
                icon: <MdSpaceDashboard />,
            },
            {
                name: "Profesionales",
                path: "/doctors",
                icon: <FaUserDoctor />
            },
            {
                name: "Configuración",
                path: "/config",
                icon: <PiGearSix />,
            },
        ],
        bottom: [
            {
                name: "Panel administración",
                path: "/admin",
                icon: <MdOutlineAdminPanelSettings />
            },
            {
                name: "Cerrar sesión",
                path: "/logout",
                icon: <GrLogout />,
            }
        ],
    };

    return (
        <section ref={root} className="absolute transition-[left] duration-300 ease-in-out top-0 left-[-15rem] sm:static sm:w-48 md:w-56 shrink-0 bg-white h-full shadow-lg z-10">
            <div className="h-20 flex items-center justify-center shadow-md z-20">
                <Image src="/logo.png" width={200} height={200} alt="Logo HealthTech" />
            </div>
            <div className="flex flex-col h-[calc(100%-5rem)] justify-between">
                {
                    (Object.keys(routes) as ("top" | "bottom")[]).map(section => (
                        <List
                            key={section}
                            sx={{ width: '100%', maxWidth: 360, padding: "0 0" }}
                            component="nav"
                        >
                            {
                                routes[section].map(route => {

                                    const isBasePath = router.pathname === route.path && route.path === "/";
                                    const isSubPath = router.pathname.startsWith(route.path) && router.pathname !== "/" && route.path !== "/";

                                    let selected = isBasePath || isSubPath;

                                    return (
                                        <Link key={route.name} href={route.path}>
                                            <ListItemButton sx={{
                                                background: selected ? theme.palette.primary.main : null,
                                                color: selected ? "#ffffff" : theme.palette.secondary.main,
                                                "&:hover": {
                                                    background: selected ? theme.palette.primary.main : null,
                                                },
                                            }}>
                                                <ListItemIcon sx={{ minWidth: 0, marginRight: 2, fontSize: "1.3em", color: selected ? "#ffffff" : theme.palette.primary.main }}>
                                                    {route.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={route.name} />
                                            </ListItemButton>
                                        </Link>
                                    );
                                })
                            }

                        </List>
                    ))
                }

            </div>


        </section>
    );
};

export default Sidebar;