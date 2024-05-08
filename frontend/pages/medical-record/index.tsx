import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";

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
import {
  FaAddressCard,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaFile,
  FaPaperclip,
  FaPhone,
  FaUser,
} from "react-icons/fa6";
import { useRouter } from "next/router";
import Link from "next/link";
import { Chip, MenuItem, Select, TextField } from "@mui/material";
import Button from "@/components/button";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { showDni } from "@/lib/dni";
import { UserResponseDto } from "@/components/dto/user.dto";
import Avatar from "@/components/avatar";

interface MedicalRecordI {
  medicalRecords: MedicalRecordResponse[];
  user: UserResponseDto;
  pages: number;
  meetings: MeetingResponseDto[];
  auth: Auth;
}

export default function MedicalRecord(props: MedicalRecordI) {
  const router = useRouter();

  const [detail, setDetail] = useState<string>();
  const [observations, setObservations] = useState<string>();
  const [meeting, setMeeting] = useState<any>();
  const [datetime, setDatetime] = useState<any>();
  const [file, setFile] = useState<any>();
  const [files, setFiles] = useState<boolean>(false);
  const [showFiles, setShowFiles] = useState<boolean>(false);

  useEffect(() => {
    moment.locale("es");
  }, []);

  const handleClickAdd = async () => {
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

      setDetail("");
      setObservations("");
      router.push(`/medical-record/${router.query.userId}`);
    }
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
        `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord/${moment(
          datetime
        ).format("YYYY-MM-DDTHH:mm:ss")}/file`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${props.auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    setFile(null);
    router.push(`/medical-record/${router.query.userId}`);
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
          className={`flex flex-col md:flex-row ${
            props.auth.role === "doctor" ? "justify-between" : "justify-center"
          } items-center px-8 pt-8`}
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
              <div className="w-44 bg-primary flex items-center justify-center p-12 rounded-full">
                <FaUser color="#ffffff" size={80} />
              </div>
            )}
            <div className="flex flex-col items-center mt-4 md:mt-0 md:ml-4">
              <h3 className="text-primary text-3xl">
                {props.user.name} {props.user.surname}
              </h3>
              <h5 className="text-md flex items-center gap-2">
                <FaEnvelope className="text-primary" /> {props.user.email}
              </h5>
              <div className="flex flex-col">
                <p className="flex items-center gap-2">
                  <FaPhone className="text-primary" /> {props.user.phone}
                </p>
                <p className="flex items-center gap-2">
                  <FaAddressCard className="text-primary" />{" "}
                  {props.user.dni && showDni(props.user.dni)}
                </p>
              </div>
            </div>
          </div>
          {props.auth.role === "doctor" ? (
            <div className="md:w-2/3">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4 md:mt-0">
                <TextField
                  onChange={($e) => setDetail($e.target.value)}
                  id="outlined-multiline-static"
                  label="Detail"
                  multiline
                  rows={4}
                  fullWidth
                  color="primary"
                  value={detail}
                  focused
                />
                <TextField
                  onChange={($e) => setObservations($e.target.value)}
                  id="outlined-multiline-static"
                  label="Observations"
                  multiline
                  rows={4}
                  fullWidth
                  color="primary"
                  value={observations}
                  focused
                />
              </div>
              <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2 md:w-1/2">
                  <h5 className="text-primary text-xl">Reunión</h5>
                  <Select
                    onChange={($e) => setMeeting($e.target.value)}
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Reunion"
                    sx={{ width: "81.9%" }}
                  >
                    {props.meetings.map(
                      (meeting: MeetingResponseDto, idx: number) => {
                        return (
                          <MenuItem
                            key={idx}
                            value={moment(meeting.startDatetime).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            )}
                          >
                            {moment(meeting.startDatetime).format("LLL")}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </div>
                <div className="mt-4 md:mt-0 w-full flex justify-center">
                  <Button
                    onClick={handleClickAdd}
                    sx={{ width: "40%", margin: "auto" }}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="mx-8 mt-8 pb-4">
          <div className="flex justify-end items-center gap-2 text-primary py-4">
            <Link
              href={`/medical-record?page=${
                router.query.page && Number(router.query.page) > 1
                  ? Number(router.query.page) - 1
                  : 1
              }`}
            >
              <FaChevronLeft className="text-2xl" />
            </Link>
            <Link
              href={`/medical-record?page=${
                router.query.page && Number(router.query.page) < props.pages
                  ? Number(router.query.page) + 1
                  : props.pages
              }`}
            >
              <FaChevronRight className="text-2xl" />
            </Link>
            <p className="text-md">
              Pagina {router.query.page ? router.query.page : 1} - {props.pages}
            </p>
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
                    Medico
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
                    <div className="flex justify-center items-center gap-2">
                      Detalle
                    </div>
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
                        <div className="flex gap-2">
                          {row.files.length === 0 &&
                            props.auth.role === "doctor" && (
                              <FaPaperclip
                                onClick={() => {
                                  const file = document.getElementById("file");
                                  setDatetime(row.datetime);
                                  setFiles(false);
                                  file?.click();
                                }}
                                className="text-primary hover:cursor-pointer hover:opacity-70"
                              />
                            )}
                          {row.files.length > 0 && (
                            <a
                              target="_blank"
                              href={`http://localhost:3000/uploads/medical-record/${row.files[0].url}`}
                            >
                              <FaFile className="text-primary text-lg hover:cursor-pointer" />
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      {row.observations ? row.observations : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <input
          type="file"
          name="file"
          id="file"
          className="hidden"
          onChange={($e) =>
            $e.target.files ? setFile($e.target.files[0]) : ""
          }
        />
        <div className="flex justify-center md:justify-normal">
          {file ? (
            <div className="md:w-1/2 p-8">
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
            </div>
          ) : (
            ""
          )}
        </div>
        {showFiles &&
          (files ? (
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
          ) : (
            <p className="text-center text-primary font-semibold">
              Actualmente no se encuentran archivos cargados en las historias
              clínicas
            </p>
          ))}
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    const { page } = context.query;
    const userId = auth?.id;

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
