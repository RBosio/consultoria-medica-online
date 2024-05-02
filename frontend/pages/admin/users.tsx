import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../shared/types";
import axios from "axios";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  FaArrowDownShortWide,
  FaArrowUpWideShort,
  FaChevronLeft,
  FaChevronRight,
  FaCircleInfo,
  FaUserDoctor,
  FaXmark,
} from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/router";
import { PRIMARY_COLOR } from "@/constants";
import { UserResponseDto } from "@/components/dto/user.dto";
import { UserHealthInsuranceResponseDto } from "@/components/dto/userHealthInsurance.dto";
import Link from "next/link";
import Button from "@/components/button";
import Input from "@/components/input";

interface Speciality {
  auth: Auth;
  users: UserResponseDto[];
}

export default function Home(props: Speciality) {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirm, setConfirm] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponseDto | null>();
  const [info, setInfo] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [usersFiltered, setUsersFiltered] = useState<any[]>([]);
  const [page, setPage] = useState<any>();
  const [o, setO] = useState(false);
  const [verify, setVerify] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setPage(1);
    const filter = props.users.filter((sp, idx) => idx >= 10 * 0 && idx < 10);
    setUsers(filter);
    setUsersFiltered(filter);
  }, []);

  const pagination = (p: number, sp?: SpecialityResponseDto[]) => {
    if (!sp) {
      if (p === 0 || p === Math.ceil(props.users.length / 10) + 1) return;

      setPage(p);
      setUsersFiltered(
        props.users.filter((sp, idx) => idx >= 10 * (p - 1) && idx < 10 * p)
      );
    } else {
      setPage(p);
      setUsersFiltered(
        sp.filter((s, idx) => idx >= 10 * (p - 1) && idx < 10 * p)
      );
    }
  };

  const onConfirmClick = async () => {
    if (confirm) {
      handleHealthInsurance();
    }
    if (verify) {
      const doctorId = Number(localStorage.getItem("doctorId"));
      handleVerification(doctorId);
    }
  };

  const handleHealthInsurance = async () => {
    const healthInsuranceId = Number(localStorage.getItem("healthInsuranceId"));
    const userHIId = Number(localStorage.getItem("userHIId"));

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userHIId}`,
      {
        healthInsuranceId,
        verify: true,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setSuccess(true);
    setMessage("Obra social validada correctamente");

    const user = props.users.find((u) => u.id === userHIId);
    user?.healthInsurances.map(
      (hi) =>
        hi.healthInsurance.id === healthInsuranceId && (hi.verified = true)
    );

    setUsers(props.users.map((u) => (u.id === userHIId ? user : u)));
    setUser(null);

    setO(false);
    setConfirm(false);

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notification`,
      {
        userIdSend: props.auth.id,
        userIdReceive: userHIId,
        type: "verificationHi",
        healthInsuranceId: healthInsuranceId,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );
  };

  const handleVerification = async (doctorId: number) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor/verify/${doctorId}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setSuccess(true);
    setMessage("Doctor verificado con éxito");

    const user = users.filter((u) => u.doctor?.id === doctorId)[0];
    user.doctor.verified = true;
    setUsers(props.users.map((u) => (u.doctor?.id === doctorId ? user : u)));

    setO(false);
    setVerify(false);

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notification`,
      {
        userIdSend: props.auth.id,
        userIdReceive: user.id,
        type: "verificationDoc",
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );
  };

  const filterChange = (name: string) => {
    setPage(1);
    setUsersFiltered(
      users.filter((u: UserResponseDto) => u.name.toLowerCase().includes(name))
    );
  };

  const [orderDirection, setOrderDirection] = useState("asc");
  const handleOrderChange = (
    event: React.MouseEvent<HTMLElement>,
    nextOrderDirection: string
  ) => {
    if (nextOrderDirection !== null) {
      setName("");
      setUsersFiltered(
        users.sort((a, b) => {
          if (nextOrderDirection === "asc") {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        })
      );
      setOrderDirection(nextOrderDirection);
    }
  };

  return (
    <Layout auth={props.auth}>
      <div id="scroller" className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-center gap-4 w-[90%] mt-12">
          <div>
            <SidebarAdmin
              auth={props.auth}
              setSidebarOpened={true}
              sidebarOpened
            />
          </div>
          <div className="bg-white p-4 w-full h-full">
            <section className="w-full rounded-md flex flex-col items-center relative">
              <div className="flex justify-between items-center gap-4 w-5/6">
                <Input
                  name="name"
                  value={name}
                  onChange={($e: any) => {
                    setName($e.target.value.toLowerCase());
                    filterChange($e.target.value.toLowerCase());
                  }}
                  startadornment={
                    <FaUserDoctor color={theme.palette.primary.main} />
                  }
                  className="w-1/2"
                  label="Nombre"
                />
                <ToggleButtonGroup
                  sx={{
                    ".MuiButtonBase-root.MuiToggleButton-root.Mui-selected": {
                      background: theme.palette.primary.light,
                    },
                  }}
                  orientation="vertical"
                  value={orderDirection}
                  onChange={handleOrderChange}
                  exclusive
                >
                  <ToggleButton value="asc" aria-label="asc">
                    <FaArrowUpWideShort />
                  </ToggleButton>
                  <ToggleButton value="desc" aria-label="desc">
                    <FaArrowDownShortWide />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className="w-5/6">
                {
                  <div className="flex justify-end items-center gap-2 text-primary py-4">
                    <FaChevronLeft
                      className="text-2xl hover:cursor-pointer"
                      onClick={() => {
                        pagination(page - 1);
                        setName("");
                      }}
                    />

                    <FaChevronRight
                      className="text-2xl hover:cursor-pointer"
                      onClick={() => {
                        pagination(page + 1);
                        setName("");
                      }}
                    />

                    <p className="text-md">
                      Pagina {page ? page : 1} -{" "}
                      {Math.ceil(props.users.length / 10)}
                    </p>
                  </div>
                }
                <TableContainer component={Paper}>
                  <Table aria-label="medical record table">
                    <TableHead sx={{ bgcolor: PRIMARY_COLOR }}>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Nombre
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Apellido
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Rol
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Obras sociales
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Operaciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {usersFiltered.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            {row.surname}
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            {row.doctor ? "Doctor" : "Paciente"}
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            <div className="flex justify-center items-center gap-2">
                              {row.healthInsurances.map(
                                (
                                  hi: UserHealthInsuranceResponseDto,
                                  idx: number
                                ) => {
                                  return (
                                    <div
                                      className="flex justify-center gap-1"
                                      key={idx}
                                    >
                                      {hi.healthInsurance.name}
                                      {hi.verified ? (
                                        <FaCheck className="text-green-500" />
                                      ) : (
                                        <FaXmark className="text-red-500" />
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            <div className="flex justify-center items-center">
                              <FaCircleInfo
                                className="text-primary hover:cursor-pointer size-4"
                                onClick={() => {
                                  setUser(row);
                                  setO(true);

                                  setInfo(true);
                                }}
                              />
                              {row?.doctor ? (
                                <>
                                  {row?.doctor.verified ? (
                                    <>
                                      <Tooltip title="Verificado">
                                        <IconButton>
                                          <FaCheck className="text-green-600 size-4" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip
                                        title="Facturación"
                                        onClick={() =>
                                          router.push(
                                            `/admin/billing/${row.id}`
                                          )
                                        }
                                      >
                                        <IconButton className="p-0">
                                          <img
                                            src="/billing.svg"
                                            className="size-6"
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    <Tooltip title="No verificado">
                                      <IconButton>
                                        <FaXmark className="text-red-600 size-4" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                        Información del usuario
                      </Typography>
                      <Typography
                        id="modal-modal-description"
                        component={"span"}
                        variant={"body2"}
                        sx={{ mt: 2 }}
                      >
                        {user && (
                          <div
                            className={`mt-4 p-4 mx-auto ${
                              !user?.doctor && "flex flex-col items-center"
                            }`}
                          >
                            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">
                                    Nombre:
                                  </p>{" "}
                                  {user.name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">
                                    Apellido:
                                  </p>{" "}
                                  {user.surname}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">Email:</p>{" "}
                                  {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">
                                    Dirección:
                                  </p>{" "}
                                  {user.address || "-"}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">
                                    Teléfono:
                                  </p>{" "}
                                  {user.phone || "-"}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">DNI:</p>{" "}
                                  {user.dni}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">
                                    Obras sociales:
                                  </p>{" "}
                                  {user.healthInsurances.map((hi, idx) => {
                                    return (
                                      <div
                                        className="flex items-center gap-2"
                                        key={idx}
                                      >
                                        <p
                                          className={`${
                                            hi.verified
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }
                                  hover:cursor-pointer hover:underline`}
                                          onClick={() => {
                                            if (hi.verified) return;

                                            localStorage.setItem(
                                              "healthInsuranceId",
                                              hi.healthInsurance.id.toString()
                                            );
                                            localStorage.setItem(
                                              "userHIId",
                                              user.id.toString()
                                            );

                                            setConfirm(true);
                                          }}
                                        >
                                          {hi.healthInsurance.name}{" "}
                                        </p>
                                        {hi.verified ? (
                                          <FaCheck className="text-green-500" />
                                        ) : (
                                          <FaXmark className="text-red-500" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-lg">
                                    Archivos:
                                  </p>{" "}
                                  {user?.healthInsurances.map((hi, idx) => {
                                    if (hi.file_url) {
                                      return (
                                        <Link
                                          key={idx}
                                          target="_blank"
                                          href={`http://localhost:3000/uploads/user/healthInsurances/${hi.file_url}`}
                                          className="flex justify-center gap-2 text-sm text-cyan-600 hover:underline"
                                        >
                                          {hi.file_name}
                                        </Link>
                                      );
                                    }
                                  })}
                                  {user.doctor?.registration && (
                                    <Link
                                      target="_blank"
                                      href={`http://localhost:3000/uploads/doctor/registration/${user.doctor.registration}`}
                                      className="flex justify-center gap-2 text-sm text-cyan-600 hover:underline"
                                    >
                                      Matrícula
                                    </Link>
                                  )}
                                  {user.doctor?.title && (
                                    <Link
                                      target="_blank"
                                      href={`http://localhost:3000/uploads/doctor/title/${user.doctor.title}`}
                                      className="flex justify-center gap-2 text-sm text-cyan-600 hover:underline"
                                    >
                                      Título
                                    </Link>
                                  )}
                                </div>
                              </div>
                              <div
                                className={`${
                                  user.doctor && "ml-24"
                                } hidden md:block`}
                              >
                                {user?.doctor && (
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <p className="text-primary text-lg">
                                        Verificado:
                                      </p>
                                      {user.doctor?.verified ? (
                                        <FaCheck className="text-green-400" />
                                      ) : (
                                        user.doctor.id && (
                                          <>
                                            <FaXmark className="text-red-400" />
                                            <Button
                                              onClick={() => {
                                                localStorage.setItem(
                                                  "doctorId",
                                                  Number(
                                                    user.doctor?.id
                                                  ).toString()
                                                );
                                                setVerify(true);
                                              }}
                                            >
                                              Verificar
                                            </Button>
                                          </>
                                        )
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-primary text-lg">
                                        Duración de la reunión:
                                      </p>
                                      {user.doctor?.durationMeeting} min
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-primary text-lg">
                                        Especialidades:{" "}
                                      </p>
                                      {user.doctor?.specialities
                                        .map((s) => s.name)
                                        .join(", ")}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="my-4 md:hidden">
                              {user?.doctor && (
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <p className="text-primary text-lg">
                                      Verificado:
                                    </p>
                                    {user.doctor?.verified ? (
                                      <FaCheck className="text-green-400" />
                                    ) : (
                                      user.doctor.id && (
                                        <>
                                          <FaXmark className="text-red-400" />
                                          <Button
                                            onClick={() => {
                                              localStorage.setItem(
                                                "doctorId",
                                                Number(
                                                  user.doctor?.id
                                                ).toString()
                                              );
                                              setVerify(true);
                                            }}
                                          >
                                            Verificar
                                          </Button>
                                        </>
                                      )
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-primary text-lg">
                                      Duración de la reunión:
                                    </p>
                                    {user.doctor?.durationMeeting} min
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-primary text-lg">
                                      Especialidades:{" "}
                                    </p>
                                    {user.doctor?.specialities
                                      .map((s) => s.name)
                                      .join(", ")}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* {user?.doctor && (
                              <div className="w-5/6 mx-auto mt-4">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                                  <p className="text-primary text-lg">
                                    Descripcion:
                                  </p>{" "}
                                  <p className="line-clamp-6">
                                    {user.doctor?.description}
                                  </p>
                                </div>
                              </div>
                            )} */}
                          </div>
                        )}
                      </Typography>
                    </Box>
                  </Fade>
                </Modal>
              </div>
            </section>
          </div>
        </div>
        <Dialog
          open={confirm || verify}
          onClose={() => {
            setConfirm(false);
            setVerify(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="text-center">
            {confirm ? "Validar obra social" : verify ? "Validar doctor" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea validar la obra social?"
                : verify
                ? "¿Desea verificar al doctor?"
                : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="text"
              onClick={() => {
                setConfirm(false);
                setVerify(false);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={onConfirmClick} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={error || success}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={4000}
          onClose={() => {
            setError(false);
            setSuccess(false);
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={error ? "error" : "success"}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let users = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${context.req.cookies.token}` },
    });

    users = users.data;

    return {
      props: {
        auth,
        users,
      },
    };
  },
  { protected: true }
);
