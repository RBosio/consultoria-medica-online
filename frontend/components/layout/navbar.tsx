import React, { useState } from "react";
import Avatar from "../avatar";
import { Auth } from "../../../shared/types";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { GrLogout } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";
import Link from "next/link";
import { Sling as Hamburger } from "hamburger-react";
import Image from "next/image";
import Profile from "../profile";
import { UserResponseDto } from "../dto/user.dto";

interface NavbarProps {
  auth: Auth;
  setSidebarOpened: any;
  sidebarOpened: boolean;
  user: UserResponseDto;
  token?: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Navbar: React.FC<NavbarProps> = (props) => {
  const theme = useTheme();
  const [menuPosition, setMenuPosition] = useState<null | HTMLElement>(null);
  const [o, setO] = useState(false);
  const open = Boolean(menuPosition);

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuPosition(event.currentTarget);
  };

  return (
    <section className="p-4 bg-white w-full shrink-0 h-20 shadow-md flex items-center justify-between md:justify-end z-10">
      <div className="md:hidden">
        <Hamburger
          size={28}
          color={theme.palette.primary.main}
          toggled={props.sidebarOpened}
          toggle={() => props.setSidebarOpened(!props.sidebarOpened)}
        />
      </div>
      <Image
        className="md:hidden"
        src="/logo.png"
        width={180}
        height={180}
        alt="Logo HealthTech"
      />
      <div className="flex items-center justify-center">
        <Tooltip placement="right" title="Perfil">
          <IconButton
            className={`rounded-md hover:bg-primary_light ${
              menuPosition ? "bg-primary" : ""
            }`}
            onClick={handleClick}
            size="small"
          >
            <Avatar
              labelProps={{ className: `${menuPosition ? "text-white" : ""}` }}
              name={props.auth.name}
              surname={props.auth.surname}
              photo={props.auth.photo}
            />
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
              overflow: "visible",
              bgcolor: theme.palette.primary.main,
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem sx={{ color: "#ffffff" }} onClick={() => setO(true)}>
            <ListItemIcon>
              <IoPersonSharp color="#ffffff" />
            </ListItemIcon>
            Perfil
          </MenuItem>
          <Divider sx={{ margin: "0.5em 0" }} color="#ffffff" />
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
      <Modal
        open={o}
        onClose={() => setO(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center"
          >
            Perfil
          </Typography>
          <Typography
            id="modal-modal-description"
            component={"span"}
            variant={"body2"}
            sx={{ mt: 2 }}
          >
            <Profile user={props.user} auth={props.auth} token={props.token} />
          </Typography>
        </Box>
      </Modal>
    </section>
  );
};

export default Navbar;
