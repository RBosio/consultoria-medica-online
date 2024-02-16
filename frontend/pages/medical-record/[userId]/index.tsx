import React from "react";
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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useRouter } from "next/router";
import Link from "next/link";

interface MedicalRecordI {
  medicalRecords: MedicalRecordResponse[];
  pages: number;
  auth: Auth;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function MedicalRecord(props: MedicalRecordI) {
  const router = useRouter();

  return (
    <Layout auth={props.auth}>
      <section className="bg-white w-5/6 m-auto">
        <div className="flex justify-end items-center gap-2 text-primary p-4">
          <Link
            href={`/medical-record/${router.query.userId}?page=${
              router.query.page && Number(router.query.page) > 1
                ? Number(router.query.page) - 1
                : 1
            }`}
          >
            <FaChevronLeft className="text-2xl" />
          </Link>
          <Link
            href={`/medical-record/${router.query.userId}?page=${
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
                  sx={{ color: "#fff", padding: "1.2rem", fontSize: "1.2rem" }}
                >
                  Nombre medico
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", padding: "1.2rem", fontSize: "1.2rem" }}
                >
                  Apellido medico
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#fff", padding: "1.2rem", fontSize: "1.2rem" }}
                >
                  Fecha
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: "#fff",
                    padding: "1.2rem",
                    fontSize: "1.2rem",
                    width: "40%",
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
              </TableRow>
            </TableHead>
            <TableBody>
              {props.medicalRecords.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    align="center"
                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                  >
                    {row.meeting.doctor.user.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                  >
                    {row.meeting.doctor.user.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                  >
                    {moment(row.datetime).format("LLL")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                  >
                    {row.detail}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                  >
                    {row.observations}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

    let pages = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/medicalRecord/user/pages/${userId}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    pages = pages.data;

    return {
      props: {
        auth,
        medicalRecords,
        pages,
      },
    };
  },
  { protected: true }
);
