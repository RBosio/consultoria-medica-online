import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../shared/types";
import axios from "axios";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCircleInfo,
  FaXmark,
} from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/router";
import { PRIMARY_COLOR } from "@/constants";
import { UserResponseDto } from "@/components/dto/user.dto";
import { UserHealthInsuranceResponseDto } from "@/components/dto/userHealthInsurance.dto";
import Link from "next/link";
import Button from "@/components/button";

interface Speciality {
  auth: Auth;
  users: UserResponseDto[];
}

export default function Home(props: Speciality) {
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirm, setConfirm] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponseDto | null>();
  const [info, setInfo] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);
  const [page, setPage] = useState<any>();

  useEffect(() => {
    setPage(1);
    setUsers(props.users.filter((sp, idx) => idx >= 10 * 0 && idx < 10));
  }, []);

  const pagination = (p: number, sp?: SpecialityResponseDto[]) => {
    if (!sp) {
      if (p === 0 || p === Math.ceil(props.users.length / 10) + 1) return;

      setPage(p);
      setUsers(
        props.users.filter((sp, idx) => idx >= 10 * (p - 1) && idx < 10 * p)
      );
    } else {
      setPage(p);
      setUsers(sp.filter((s, idx) => idx >= 10 * (p - 1) && idx < 10 * p));
    }
  };

  const onConfirmClick = async () => {
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

    setConfirm(false);
    router.push(`/admin`);
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center">
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
              <div className="w-5/6">
                {
                  <div className="flex justify-end items-center gap-2 text-primary py-4">
                    <FaChevronLeft
                      className="text-2xl hover:cursor-pointer"
                      onClick={() => {
                        pagination(page - 1);
                      }}
                    />

                    <FaChevronRight
                      className="text-2xl hover:cursor-pointer"
                      onClick={() => {
                        pagination(page + 1);
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
                      {users.map((row) => (
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
                            <div
                              className="flex justify-center items-center gap-4 text-primary p-2 hover:cursor-pointer"
                              onClick={() => {
                                setUser(row);
                                setTest(row.healthInsurances);
                                setInfo(true);
                              }}
                            >
                              <FaCircleInfo />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="bg-white mt-4">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between w-5/6 mx-auto">
                    {user && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Nombre:</p>{" "}
                          {user.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Apellido:</p>{" "}
                          {user.surname}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Email:</p>{" "}
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Teléfono:</p>{" "}
                          {user.phone || "-"}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Dni:</p>{" "}
                          {user.dni}
                        </div>
                      </div>
                    )}
                    {user?.doctor && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Verificado:</p>
                          {user.doctor?.verified ? (
                            <FaCheck className="text-green-400" />
                          ) : (
                            <FaXmark className="text-red-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">
                            Duración de la reunión:
                          </p>
                          {user.doctor?.durationMeeting} min
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-primary text-lg">Dirección:</p>
                          {user.doctor?.address}
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
                  <div className="w-5/6 mx-auto mt-2">
                    {user && (
                      <>
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
                                  {hi.healthInsurance.name}
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
                          <p className="text-primary text-lg">Archivos:</p>{" "}
                          {user?.healthInsurances.map((hi, idx) => {
                            if (hi.file_url) {
                              return (
                                <Link
                                  key={idx}
                                  target="_blank"
                                  href={`http://localhost:3000/uploads/user/healthInsurances/${hi.file_url}`}
                                  className="flex justify-center gap-2 underline text-sm"
                                >
                                  {hi.file_name}
                                </Link>
                              );
                            }
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-5/6 mx-auto mt-4">
                    {user?.doctor && (
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                        <p className="text-primary text-lg">Descripcion:</p>{" "}
                        {user.doctor?.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <Dialog
          open={confirm}
          onClose={() => {
            setConfirm(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="text-center">
            {confirm ? "Validar obra social" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm ? "¿Desea validar la obra social?" : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="text"
              onClick={() => {
                setConfirm(false);
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
