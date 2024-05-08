import React, { ReactElement, useEffect, useState } from "react";
import Avatar from "../avatar";
import { Auth } from "../../../shared/types";
import {
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { GrLogout } from "react-icons/gr";
import { FaUserDoctor } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import Link from "next/link";
import { Sling as Hamburger } from "hamburger-react";
import Image from "next/image";
import { FaAngleRight, FaBell } from "react-icons/fa6";
import axios from "axios";
import { NotificationResponseDto } from "../dto/notification.dto";
import moment from "moment";
import "moment/locale/es";
import { useRouter } from "next/router";

interface NavbarProps {
  auth: Auth;
  setSidebarOpened: any;
  sidebarOpened: boolean;
  renderSidebar: boolean;
  leftElement?: ReactElement;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    moment.locale("es");
  }, []);

  const [menuPosition, setMenuPosition] = useState<null | HTMLElement>(null);
  const [notifyPosition, setNotifyPosition] = useState<null | HTMLElement>(
    null
  );
  const [openN, setOpenN] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>(
    []
  );
  const open = Boolean(menuPosition);
  const openNotify = Boolean(notifyPosition);

  const handleClose = () => {
    setMenuPosition(null);
    setNotifyPosition(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuPosition(event.currentTarget);
  };

  const handleClickNotify = (event: React.MouseEvent<HTMLElement>) => {
    setNotifyPosition(event.currentTarget);
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
    <section
      className={`p-4 bg-white w-full shrink-0 h-20 shadow-md flex items-center justify-between ${
        props.leftElement ? "" : "md:justify-end"
      } z-10`}
    >
      {props.leftElement}
      {props.renderSidebar && (
        <div className="md:hidden">
          <Hamburger
            size={28}
            color={theme.palette.primary.main}
            toggled={props.sidebarOpened}
            toggle={() => props.setSidebarOpened(!props.sidebarOpened)}
          />
        </div>
      )}
      <Image
        className="md:hidden"
        src="/logo.png"
        width={180}
        height={180}
        alt="Logo HealthTech"
        onClick={() => router.push("/")}
      />
      <div className="flex items-center justify-center relative">
        <Tooltip placement="bottom" title="Notificaciones">
          <IconButton onClick={handleClickNotify} size="small">
            <Badge
              badgeContent={notifications.filter((n) => !n.readed).length}
              color="primary"
              className="text-secondary text-2xl mx-4 hover:cursor-pointer hover:opacity-70"
            >
              <FaBell className={openN ? "text-primary" : ""} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notifyPosition}
          id="account-menu"
          open={openNotify}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              bgcolor: "#fff",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <div className="min-w-[500px]">
            <div className="bg-primary flex justify-end absolute top-0 w-full rounded-md">
              {notifications.length > 0 ? (
                <p
                  className="text-white text-xl mx-4 p-4 hover:underline hover:cursor-pointer"
                  onClick={markAsReadAll}
                >
                  Leer todos
                </p>
              ) : (
                <p className="text-xl text-white p-4">
                  Por el momento no existen notificaciones a mostrar
                </p>
              )}
              <div className="bg-primary w-full h-1 absolute bottom-0"></div>
            </div>
            {notifications.length > 0 ? (
              <div className="max-h-80 overflow-y-scroll mt-16">
                {notifications.map((n) => {
                  return (
                    <Link
                      key={n.id}
                      href={
                        n.type === "comment"
                          ? `/meetings/${btoa(
                              n.meeting.userId +
                                "." +
                                moment(n.meeting.startDatetime).format(
                                  "YYYY-MM-DDTHH:mm:ss"
                                )
                            )}`
                          : n.type === "verification hi"
                          ? `/admin/users`
                          : n.type === "verificationHi"
                          ? "/profile"
                          : n.type === "verificationDoc"
                          ? "/profile"
                          : n.type === "meeting"
                          ? `/meetings/${btoa(
                              n.meeting.userId +
                                "." +
                                moment(n.meeting.startDatetime).format(
                                  "YYYY-MM-DDTHH:mm:ss"
                                )
                            )}`
                          : n.type === "rdatetime"
                          ? `/meetings/${btoa(
                              n.userIdSend +
                                "." +
                                moment(n.mStartDNew).format(
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
                      <MenuItem sx={{ color: "#ffffff" }}>
                        <div className="text-black w-full">
                          <div className="p-2">
                            <div className="flex justify-between items-center">
                              <div
                                className={`w-2 h-2 rounded-full m-2 ${
                                  !n.readed ? "bg-primary" : ""
                                }`}
                              ></div>

                              <div className="mr-2 w-full">
                                <div className="flex items-center gap-2">
                                  <p className="p-2 text-lg">
                                    {n.type === "verification" ? (
                                      `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de su cuenta`
                                    ) : n.type === "comment" ? (
                                      <>
                                        El{" "}
                                        {props.auth.role === "user"
                                          ? "doctor"
                                          : "usuario"}{" "}
                                        {n.userSend.surname}, {n.userSend.name}{" "}
                                        realizó un comentario en la reunión del
                                        día{" "}
                                        <span>
                                          {moment(
                                            n.meeting.startDatetime
                                          ).format("LLL")}
                                        </span>
                                      </>
                                    ) : n.type === "verificationHiRequest" ? (
                                      `El ${
                                        n.userSend.doctor ? "doctor" : "usuario"
                                      } ${n.userSend.surname}, ${
                                        n.userSend.name
                                      } solicitó verificación de la obra social ${
                                        n.healthInsurance.name
                                      }`
                                    ) : n.type === "verificationHi" ? (
                                      `El administrador ${n.userSend.surname}, ${n.userSend.name} acaba de realizar la verificación de la obra social ${n.healthInsurance.name}`
                                    ) : n.type === "meeting" ? (
                                      `El usuario ${n.userSend.surname}, ${
                                        n.userSend.name
                                      } acaba de solicitar una reunión para el día ${moment(
                                        n.meeting.startDatetime
                                      ).format("LLL")}
                                      `
                                    ) : n.type === "verificationDoc" ? (
                                      `El administrador ${n.userSend.surname}, ${n.userSend.name} acaba de realizar la verificación su cuenta`
                                    ) : n.type === "rdatetime" ? (
                                      `El paciente ${n.userSend.surname}, ${
                                        n.userSend.name
                                      } acaba de realizar la modificación de la reunión del día ${moment(
                                        n.mStartDOld
                                      ).format("LLLL")} hs para el día ${moment(
                                        n.mStartDNew
                                      ).format("LLLL")} hs`
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </div>
                                <p className="text-sm text-right p-2 text-gray-400">
                                  {moment(n.created_at).format("LLL")}
                                </p>
                              </div>
                              <div className="min-w-12 flex justify-end gap-2 text-xl text-primary">
                                <FaAngleRight className="hover:opacity-70" />
                              </div>
                            </div>
                          </div>
                          <div className="w-[90%] border-b-2 border-primary h-2 m-auto"></div>
                        </div>
                      </MenuItem>
                    </Link>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </Menu>
        <Tooltip className="hidden md:block" placement="bottom" title="Perfil">
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
          <Link href="/profile">
            <MenuItem sx={{ color: "#ffffff" }}>
              <ListItemIcon>
                <IoPersonSharp color="#ffffff" />
              </ListItemIcon>
              Perfil
            </MenuItem>
          </Link>
          <Divider sx={{ margin: "0.5em 0" }} color="#ffffff" />
          {props.auth.role === "user" && (
            <Link href="/register_doctor">
              <MenuItem sx={{ color: "#ffffff" }}>
                <ListItemIcon>
                  <FaUserDoctor color="#ffffff" />
                </ListItemIcon>
                ¿Eres un profesional médico?
              </MenuItem>
            </Link>
          )}
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
