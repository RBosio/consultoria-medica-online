import React from "react";
import Avatar from "../avatar";
import { Auth } from "../../../shared/types";
import { Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material";
import { GrLogout } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";
import Link from "next/link";

interface NavbarProps {
    auth: Auth,
}


const Navbar: React.FC<NavbarProps> = (props) => {

    const theme = useTheme();
    const [menuPosition, setMenuPosition] = React.useState<null | HTMLElement>(null);
    const open = Boolean(menuPosition);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setMenuPosition(event.currentTarget);
    };
    const handleClose = () => {
        setMenuPosition(null);
    };

    return (
        <section className="p-4 bg-white w-full shrink-0 h-20 shadow-lg flex items-center justify-between sm:justify-end">
            <button className="sm:hidden">CERRAR</button>
            <div className="flex items-center justify-center">
                <Tooltip placement="right" title="Perfil">
                    <IconButton className={`group gap-2 ml-2 rounded-md p-2 hover:bg-primary_light ${menuPosition ? "bg-primary" : ""}`} onClick={handleClick}
                        size="small"
                        aria-controls={true ? 'Perfil' : undefined}
                        aria-haspopup="true"
                        aria-expanded={true ? 'true' : undefined}>
                        <Avatar name={props.auth.name} surname={props.auth.surname} photo={props.auth.photo} />
                        <span className={`text-secondary ${menuPosition ? "text-white" : ""}`}>{props.auth.name} {props.auth.surname}</span>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={menuPosition}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            bgcolor: theme.palette.primary.main,
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1,
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Link href="/config">
                        <MenuItem sx={{ color: "#ffffff" }} onClick={handleClose}>
                            <ListItemIcon>
                                <IoPersonSharp color="#ffffff" />
                            </ListItemIcon>
                            Ir a Perfil
                        </MenuItem>
                    </Link>
                    <Divider sx={{margin: "0.5em 0"}} color="#ffffff" />
                    <Link href="/logout">
                        <MenuItem sx={{ color: "#ffffff" }} onClick={handleClose}>
                            <ListItemIcon>
                                <GrLogout color="#ffffff" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Link>
                </Menu>
            </div>
        </section>
    );
};

export default Navbar;