import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";

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
import {
  FaChevronLeft,
  FaChevronRight,
  FaFile,
  FaPaperclip,
  FaUser,
} from "react-icons/fa6";
import { useRouter } from "next/router";
import Link from "next/link";
import { Chip } from "@mui/material";
import Button from "@/components/button";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
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
              <h3 className="text-primary text-2xl">{props.user.name} {props.user.surname}</h3>
            </div>
          </div>
        </div>
        <div className="mx-8 mt-8 pb-4">
          <div className="flex justify-end items-center gap-2 text-primary py-4">
            <Link
              href={`/medical-record?page=${router.query.page && Number(router.query.page) > 1
                ? Number(router.query.page) - 1
                : 1
                }`}
            >
              <FaChevronLeft className="text-2xl" />
            </Link>
            <Link
              href={`/medical-record?page=${router.query.page && Number(router.query.page) < props.pages
                ? Number(router.query.page) + 1
                : props.pages
                }`}
            >
              <FaChevronRight className="text-2xl" />
            </Link>
            <p className="text-md">
              Página {router.query.page ? router.query.page : 1} - {props.pages}
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
