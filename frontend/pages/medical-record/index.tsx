import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../types";

import { robotoBold } from "@/lib/fonts";
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
import { FaChevronLeft, FaChevronRight, FaFile, FaUser } from "react-icons/fa6";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box, Chip, Fade, Modal } from "@mui/material";
import Button from "@/components/button";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { UserResponseDto } from "@/components/dto/user.dto";
import Avatar from "@/components/avatar";
import Paginator from "@/components/paginator";

interface MedicalRecordI {
  medicalRecords: MedicalRecordResponse[];
  user: UserResponseDto;
  pages: number;
  meetings: MeetingResponseDto[];
  auth: Auth;
}

export default function MedicalRecord(props: MedicalRecordI) {
  const router = useRouter();
  const [modal, setModal] = useState<boolean>(false);
  const [filesU, setFilesU] = useState<any[]>([]);

  useEffect(() => {
    moment.locale("es");
  }, []);

  return (
    <Layout auth={props.auth}>
      <section className="bg-white w-5/6 mx-auto">
        <div
          className={`flex flex-col md:flex-row ${props.auth.role === "doctor" ? "justify-between" : "justify-center"
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
              <h2 className={`text-primary text-3xl ${robotoBold.className}`}>
                Historia clínica
              </h2>
              <h3 className="text-primary text-2xl">
                {props.user.name} {props.user.surname}
              </h3>
            </div>
          </div>
        </div>
        <div className="mx-8 mt-8 pb-4">
          <div className="mb-4">
            <Paginator pages={props.pages} route="/medical-record"></Paginator>
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
                  <TableCell
                    align="center"
                    sx={{
                      color: "#fff",
                      padding: "1.2rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    Archivos
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
                      <div className="flex justify-center items-center gap-2 xl:break-words">
                        {row.detail}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      <div className="xl:break-words">
                        {row.observations ? row.observations : "-"}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-sm"
                      align="center"
                      sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                    >
                      {row.files.length > 0 ? (
                        <div className="flex justify-center">
                          <FaFile
                            onClick={() => {
                              setFilesU(row.files);
                              setModal(true);
                            }}
                            className="text-primary text-lg hover:cursor-pointer hover:opacity-70"
                          />
                        </div>
                      ) : '-'}
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
        <Modal
          open={modal}
          onClose={() => {
            setModal(false);
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
              <div className="flex flex-col gap-2">
                <h2
                  className={`${robotoBold.className} text-primary text-xl mb-2`}
                >
                  Archivos
                </h2>
                <div>
                  <div className="flex flex-col gap-3">
                    {filesU.map((f) => {
                      return (
                        <a
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/medical-record/${f.url}`}
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
  { protected: true, roles: ['user', 'admin'] }
);
