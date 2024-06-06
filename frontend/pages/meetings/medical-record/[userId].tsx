import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../../shared/types";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PRIMARY_COLOR } from "@/constants";
import axios from "axios";
import { MedicalRecordResponse } from "@/components/dto/medical-record.dto";
import moment from "moment";
import "moment/locale/es";
import { robotoBold } from "@/lib/fonts";
import {
  FaAddressCard,
  FaCalendarDays,
  FaChevronLeft,
  FaChevronRight,
  FaFile,
  FaKitMedical,
  FaMars,
  FaPaperclip,
  FaUser,
  FaVenus,
} from "react-icons/fa6";
import { useRouter } from "next/router";
import { IoAdd } from "react-icons/io5";
import Link from "next/link";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  Fade,
  Modal,
  Snackbar,
} from "@mui/material";
import Button from "@/components/button";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { showDni } from "@/lib/dni";
import { UserResponseDto } from "@/components/dto/user.dto";
import Avatar from "@/components/avatar";
import Input from "@/components/input";
import { FaEdit } from "react-icons/fa";

interface MedicalRecordI {
  medicalRecords: MedicalRecordResponse[];
  user: UserResponseDto;
  pages: number;
  meetings: MeetingResponseDto[];
  auth: Auth;
}

export default function MedicalRecord(props: MedicalRecordI) {
  const router = useRouter();

  const [detail, setDetail] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [meeting, setMeeting] = useState<any>();
  const [file, setFile] = useState<any>();
  const [files, setFiles] = useState<boolean>(false);
  const [filesU, setFilesU] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [medicalRecordId, setMedicalRecordId] = useState<number>();
  const [modal, setModal] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);

  useEffect(() => {
    moment.locale("es");
  }, []);

  const handleClickAdd = async () => {

    let success = false;

    if (add) {
      if (detail && meeting) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord`,
          {
            datetime: new Date(),
            detail,
            observations,
            userId: router.query.userId,
            startDatetime: meeting,
          },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );

        success = true;
        setSuccess(true);
        setMessage("Se ha agregado el registro médico correctamente");
        setAdd(false);
      } else {
        setError(true);
        setMessage(
          "Por favor, indique la reunión y el detalle de la misma. Las observaciones son opcionales"
        );
      }

    } else {
      if (detail.length === 0) {
        setMessage("El detalle es requerido");
        setError(true);
        return;
      }

      if (detail.length > 60) {
        setMessage("El detalle debe tener como máximo 60 caracteres");
        setError(true);
        return;
      }

      if (observations.length > 100) {
        setMessage("Las observaciones deben tener como máximo 100 caracteres");
        setError(true);
        return;
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord/${medicalRecordId}`,
        {
          detail,
          observations,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      success = true;
      setSuccess(true);
      setMessage("Se ha actualizado el registro médico correctamente");
    }

    if (success) {
      setModal(false);
      setDetail("");
      setObservations("");
      router.push(`/meetings/medical-record/${router.query.userId}`);
    };

  };

  const handleClickAddFile = async () => {
    if (
      file.type?.includes("office") ||
      file.type?.includes("pdf") ||
      file.type?.includes("jpg") ||
      file.type?.includes("jpeg") ||
      file.type?.includes("png")
    ) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", file.type);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord/${id}/file`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${props.auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(file);

      setSuccess(true);
      setMessage("Se ha agregado el archivo correctamente");
      setModal(false);
      setFile(false);
      setUpload(false);
    } else {
      setError(true);
      setMessage("Por favor, seleccione un archivo valido");
    }

    setFile(null);
    router.push(`/meetings/medical-record/${router.query.userId}`);
  };

  async function handleClick(url: string, name: string, type: string) {
    await axios({
      url: `http://localhost:3000/uploads/medical-record/${url}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      if (type.includes("office")) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}`);
        document.body.appendChild(link);
        link.click();
      }
    });
  }

  return (
    <Layout auth={props.auth}>
      <section className="bg-white w-5/6 mx-auto">
        <div
          className={`flex flex-col md:flex-row justify-center items-center px-8 pt-8`}
        >
          <div className="flex flex-col md:flex-row items-center">
            {props.user.image ? (
              <Avatar
                labelProps={{ className: "hidden" }}
                name={props.user.name}
                surname={props.user.surname}
                className="bg-primary"
                size={200}
                icon={<FaUser size={100} />}
                photo={props.user.image ? `${props.user.image}` : undefined}
              />
            ) : (
              <>
                <div className="w-44 bg-primary flex items-center justify-center p-12 rounded-full">
                  <FaUser color="#ffffff" size={80} />
                </div>
              </>
            )}
            <div className="flex flex-col items-center ml-4">
              <h2 className={`text-primary text-3xl ${robotoBold.className}`}>
                Historia clínica
              </h2>
              <h3 className="text-primary text-2xl">
                {props.user.name} {props.user.surname}
              </h3>
              <div className="flex flex-col">
                <p className="flex items-center gap-2">
                  <FaAddressCard className="text-primary" />{" "}
                  {props.user.dni && showDni(props.user.dni)}
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarDays className="text-primary" />{" "}
                  {moment().diff(props.user.birthday, "years")} años
                </p>
                <p className="flex items-center gap-2">
                  {props.user.gender ? (
                    <FaMars className="text-primary" />
                  ) : (
                    <FaVenus className="text-primary" />
                  )}
                  {props.user.gender ? "Masculino" : "Femenino"}
                </p>
                <div className="flex items-center gap-2">
                  <FaKitMedical className="text-primary" />
                  <div className="flex items-center gap-4">
                    {props.user.healthInsurances.length > 0
                      ? props.user.healthInsurances.map((hi) => {
                        return (
                          <p>
                            {hi.healthInsurance.name} ({hi.cod})
                          </p>
                        );
                      })
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-8 mt-8 pb-4">
          <div className="flex justify-between items-center gap-2 text-primary mb-6">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setModal(true);
                  setAdd(true);
                  setUpload(false);
                }}
                startIcon={<IoAdd />}
                className="mr-auto"
              >
                Nueva historia clínica
              </Button>
            </div>
            <div className="flex justify-center items-center gap-1">
              <Link
                href={`/meetings/medical-record/${router.query.userId}?page=${router.query.page && Number(router.query.page) > 1
                    ? Number(router.query.page) - 1
                    : 1
                  }`}
              >
                <FaChevronLeft className="text-2xl" />
              </Link>
              <Link
                href={`/meetings/medical-record/${router.query.userId}?page=${router.query.page && Number(router.query.page) < props.pages
                    ? Number(router.query.page) + 1
                    : props.pages + 1
                  }`}
              >
                <FaChevronRight className="text-2xl" />
              </Link>
              <p className="text-md">
                Página {router.query.page ? router.query.page : 1} -{" "}
                {props.pages === 0 ? 1 : props.pages}
              </p>
            </div>
          </div>
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
                    Médico
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#fff",
                      padding: "1.2rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Especialidad
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#fff",
                      padding: "1.2rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Fecha de la reunión
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#fff",
                      padding: "1.2rem",
                      fontSize: "1.2rem",
                      width: "30%",
                    }}
                  >
                    Detalle
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#fff",
                      padding: "1.2rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Observaciones
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
                {props.medicalRecords.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      {row.meeting.doctor.user.surname +
                        ", " +
                        row.meeting.doctor.user.name}
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      <div className="flex justify-center gap-2">
                        {row.meeting.doctor.specialities.map((s) => {
                          return (
                            <Chip
                              key={s.id}
                              size="small"
                              variant="outlined"
                              color="primary"
                              label={s.name}
                            />
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      {moment(row.meeting.startDatetime).format("LLL")}
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      <div className="flex justify-center items-center gap-2">
                        {row.detail}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      {row.observations ? row.observations : "-"}
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      {props.auth.id === row.meeting.doctor.user.id && (
                        <div className="flex justify-center items-center gap-2">
                          <FaEdit
                            className="text-primary text-lg hover:cursor-pointer hover:opacity-70"
                            onClick={() => {
                              setModal(true);
                              setUpload(false);
                              setDetail(row.detail);
                              setObservations(row.observations ?? '');
                              setMedicalRecordId(row.id);
                            }}
                          />
                          <FaFile
                            onClick={() => {
                              setId(row.id);
                              setModal(true);
                              setUpload(true);
                              setAdd(false);
                              setFilesU(row.files);
                            }}
                            className="text-primary text-lg hover:cursor-pointer hover:opacity-70"
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {props.medicalRecords.length === 0 && (
            <p className="text-center text-xl text-slate-400 mt-4">
              No se encontraron resultados
            </p>
          )}
        </div>
        <input
          type="file"
          name="file"
          id="file"
          className="hidden"
          onChange={($e: any) => {
            setFile($e?.target?.files[0]);
          }}
        />
        {files && (
          <div className="flex justify-center items-center gap-2 text-xl p-4">
            {props.medicalRecords.map((mr, idx) => {
              return (
                <div key={idx}>
                  {mr.files[0]?.type.includes("office") ? (
                    <p
                      className="text-primary mt-[2px] p-[2px] rounded-sm hover:cursor-pointer hover:opacity-70 underline"
                      onClick={() =>
                        handleClick(
                          mr.files[0].url,
                          mr.files[0].name,
                          mr.files[0].type
                        )
                      }
                    >
                      {mr.files[0]?.name}
                    </p>
                  ) : (
                    <Link
                      className="flex items-center"
                      target="_blank"
                      href={`http://localhost:3000/uploads/medical-record/${mr.files[0]?.url}`}
                    >
                      <p className="text-primary mt-[2px] p-[2px] rounded-sm hover:cursor-pointer hover:opacity-70 underline">
                        {mr.files[0]?.name}
                      </p>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
        <Modal
          open={modal}
          onClose={() => {
            setModal(false);
            setAdd(false);
            setDetail("");
            setObservations("");
          }}
        >
          <Fade in={modal}>
            <Box
              className="w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12"
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
              <div className="flex flex-col gap-6">
                <h2
                  className={`${robotoBold.className} text-primary text-xl mb-2`}
                >
                  {!upload
                    ? add
                      ? "Agregar historia clínica"
                      : "Editar historia clínica"
                    : "Archivos"}
                </h2>
                {!upload ? (
                  <>
                    {add && (
                      <Autocomplete
                        onChange={(event, newValue: any) =>
                          setMeeting(newValue ? newValue.id : null)
                        }
                        disablePortal
                        noOptionsText="No hay reuniones realizadas"
                        options={props.meetings.map(
                          (meeting: MeetingResponseDto) => ({
                            id: moment(meeting.startDatetime).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            ),
                            label: moment(meeting.startDatetime).format("LLL"),
                          })
                        )}
                        renderInput={(params: any) => (
                          <Input
                            variant="outlined"
                            onChange={() => {}}
                            name="healthInsuranceId"
                            {...params}
                            label="Reunión"
                          />
                        )}
                      />
                    )}
                    <Input
                      onChange={($e) => setDetail($e.target.value)}
                      label="Detalle"
                      multiline
                      rows={4}
                      fullWidth
                      color="primary"
                      variant="outlined"
                      value={detail}
                    />
                    <Input
                      onChange={($e) => setObservations($e.target.value)}
                      label="Observaciones"
                      fullWidth
                      value={observations}
                      variant="outlined"
                    />
                    <Button onClick={handleClickAdd}>ACEPTAR</Button>
                  </>
                ) : (
                  <div>
                    <div>
                      <div className="flex justify-between items-center gap-2">
                        <Button
                          onClick={() => {
                            const file = document.getElementById("file");
                            setFiles(false);
                            file?.click();
                          }}
                        >
                          SUBIR ARCHIVO
                        </Button>
                        {file && (
                          <div className="flex items-center gap-2">
                            {file?.type.includes("office") ? (
                              <p className="text-primary mt-[2px] p-[2px] rounded-sm underline">
                                {file?.name}
                              </p>
                            ) : (
                              <p className="text-primary mt-[2px] p-[2px] rounded-sm underline">
                                {file?.name}
                              </p>
                            )}
                            <Button
                              startIcon={<FaPaperclip />}
                              className="bg-primary text-white"
                              onClick={handleClickAddFile}
                            >
                              Agregar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {filesU.length > 0 &&
                        filesU.map((f) => {
                          return (
                            <a
                              target="_blank"
                              href={`http://localhost:3000/uploads/medical-record/${f.url}`}
                            >
                              <Chip
                                size="medium"
                                variant="outlined"
                                color="primary"
                                className={`${robotoBold.className} hover:bg-primary hover:text-white`}
                                label={f.name}
                              />
                            </a>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </Box>
          </Fade>
        </Modal>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    const { userId, page } = context.query;

    let medicalRecords = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord/user/${userId}?page=${page}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    medicalRecords = medicalRecords.data;

    let user = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/id/${userId}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    user = user.data;

    let pages = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord/user/pages/${userId}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    pages = pages.data;

    let meetings = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/medicalRecord/${userId}/${auth?.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    meetings = meetings.data;

    return {
      props: {
        auth,
        medicalRecords,
        user,
        pages,
        meetings,
      },
    };
  },
  { protected: true }
);
