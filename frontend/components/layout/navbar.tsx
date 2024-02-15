import React, { useEffect, useState } from "react";
import Avatar from "../avatar";
import { Auth } from "../../../shared/types";
import {
  Badge,
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
import Fade from "@mui/material/Fade";
import {
  FaAngleRight,
  FaBell,
  FaEnvelope,
  FaEnvelopeOpen,
} from "react-icons/fa6";
import axios from "axios";
import { NotificationResponseDto } from "../dto/notification.dto";
import moment from "moment";
import { useRouter } from "next/router";

interface NavbarProps {
  auth: Auth;
  setSidebarOpened: any;
  sidebarOpened: boolean;
  renderSidebar: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const theme = useTheme();
  const router = useRouter();

  const [menuPosition, setMenuPosition] = useState<null | HTMLElement>(null);
  const [o, setO] = useState(false);
  const [openN, setOpenN] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>(
    []
  );
  const open = Boolean(menuPosition);

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuPosition(event.currentTarget);
  };

  useEffect(() => {
    const func = async () => {
      const notifications = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/${props.auth.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
      setNotifications(notifications.data);
    };

    func();
  }, []);

  const markAsRead = async (id: number) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${id}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    const notifications = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${props.auth.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );
    setNotifications(notifications.data);
  };

  const markAsReadAll = async () => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/readAll/${props.auth.id}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    const notifications = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${props.auth.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );
    setNotifications(notifications.data);
  };

  return (
    <section className="p-4 bg-white w-full shrink-0 h-20 shadow-md flex items-center justify-between md:justify-end z-10">
      {props.renderSidebar && <div className="md:hidden">
        <Hamburger
          size={28}
          color={theme.palette.primary.main}
          toggled={props.sidebarOpened}
          toggle={() => props.setSidebarOpened(!props.sidebarOpened)}
        />
      </div>
      }
      <Image
        className="md:hidden"
        src="/logo.png"
        width={180}
        height={180}
        alt="Logo HealthTech"
      />
      <div className="flex items-center justify-center relative">
        <Badge
          badgeContent={notifications.filter((n) => !n.readed).length}
          color="primary"
          className="text-secondary text-2xl mx-4 hover:cursor-pointer hover:opacity-70"
          onClick={() => setOpenN(!openN)}
        >
          <FaBell className={openN ? 'text-primary' : ''} />
        </Badge>
        <div
          className={`absolute w-[36rem] h-72 -bottom-[19rem] ${openN ? "-right-4" : "-right-[38rem]"
            } transition-all duration-500 ease-in
           bg-white border-primary border-4 rounded-md z-50 overflow-y-scroll px-2`}
        >
          <div className="flex justify-end">
            <p
              className="text-primary p-2 hover:underline hover:cursor-pointer"
              onClick={markAsReadAll}
            >
              Leer todos
            </p>
          </div>
          {notifications.map((n) => {
            return (
              <div key={n.id} className="p-2">
                <div className="flex justify-between items-center">
                  <div
                    className={`w-2 h-2 rounded-full m-2 ${!n.readed ? "bg-primary" : ""
                      }`}
                  ></div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="p-2">
                        {n.type === "verification" ? (
                          `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de su cuenta`
                        ) : n.type === "comment" ? (
                          <>
                            El{" "}
                            {props.auth.role === "user" ? "doctor" : "usuario"}{" "}
                            {n.userSend.surname}, {n.userSend.name} realizó un
                            comentario en la reunión del día{" "}
                            <span>
                              {moment(n.meeting.startDatetime).format("LLL")}
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                    <p className="text-primary text-right">
                      {moment(n.created_at).format("LLL")}
                    </p>
                  </div>
                  <div className="min-w-12 flex justify-end gap-2 text-primary text-xl">
                    {!n.readed ? (
                      <FaEnvelope
                        className="hover:cursor-pointer hover:opacity-70"
                        onClick={() => markAsRead(n.id)}
                      />
                    ) : (
                      <FaEnvelopeOpen />
                    )}
                    <Link
                      href={
                        n.type === "comment"
                          ? `/meetings/${btoa(
                            n.meeting.userId +
                            "." +
                            moment(n.meeting.startDatetime).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            )
                          )}`
                          : ""
                      }
                      onClick={() => {
                        markAsRead(n.id);
                        setOpenN(!openN);
                      }}
                    >
                      <FaAngleRight className="hover:opacity-70" />
                    </Link>
                  </div>
                </div>
                <div className="w-[90%] border-b-2 border-primary h-2 m-auto"></div>
              </div>
            );
          })}
        </div>
        <Tooltip placement="right" title="Perfil">
          <IconButton
            className={`rounded-md hover:bg-primary_light ${menuPosition ? "bg-primary" : ""
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
        <Fade in={o}>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              bgcolor: "background.paper",

              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="text-center text-primary text-2xl"
            >
              Perfil de usuario
            </Typography>
            <Typography
              id="modal-modal-description"
              component={"span"}
              variant={"body2"}
              sx={{ mt: 2 }}
            >
              <Profile auth={props.auth} />
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </section>
  );
};

export default Navbar;
