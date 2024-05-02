import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import { useRouter } from "next/router";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import moment from "moment";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaCircleInfo } from "react-icons/fa6";
import {
  Autocomplete,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PRIMARY_COLOR } from "@/constants";
import { pesos } from "@/lib/formatCurrency";
import Button from "@/components/button";
import Input from "@/components/input";

const Months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Home(props: any) {
  const [meetings, setMeetings] = useState<MeetingResponseDto[]>([]);
  const [pageMeetings, setPageMeetings] = useState<MeetingResponseDto[]>([]);
  const [month, setMonth] = useState<string>("");
  const [pages, setPages] = useState<number>(-1);
  const [page, setPage] = useState<number>(-1);
  const [total, setTotal] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const m: MeetingResponseDto[] = props.lastMeetings.filter(
      (meeting: MeetingResponseDto) => {
        return (
          new Date().getMonth() === new Date(meeting.startDatetime).getMonth()
        );
      }
    );
    setMeetings(m);
    setTotal(m.map((m) => +m.price).reduce((acum, value) => acum + value, 0));

    if (!router.query.page) {
      setPage(1);
      setPageMeetings(m.filter((_, idx) => idx < 5));
    }

    setMonth(Months[new Date().getMonth()]);

    setPages(Math.ceil(props.lastMeetings.length / 5));
  }, []);

  const paginated = (asc?: boolean) => {
    if (asc) {
      setPage(page + 1);
      console.log(meetings);
      setPageMeetings(
        meetings.filter((_, idx) => idx < (page + 1) * 5 && idx >= page * 5)
      );
    } else {
      setPage(page - 1);
      if (page - 1 === 1) {
        setPageMeetings(meetings.filter((_, idx) => idx < 5));
        return;
      }

      setPageMeetings(
        meetings.filter(
          (_, idx) => idx < (page - 1) * 5 && idx > (page - 2) * 5
        )
      );
    }
  };

  const reset = (m: MeetingResponseDto[]) => {
    setPage(1);
    setPageMeetings(m.filter((_, idx) => idx < 5));
    m.length === 0 ? setPages(1) : setPages(Math.ceil(m.length / 5));
  };

  return (
    <Layout auth={props.auth}>
      <div className="xl:w-[70%] p-4 flex flex-col xl:flex-row justify-between gap-4 mx-auto">
        <div className="xl:w-[70%]">
          <h2 className="text-3xl text-center xl:text-left">
            Reuniones de{" "}
            <span className="text-primary font-semibold">
              {props.lastMeetings[0].doctor.user.surname},{" "}
              {props.lastMeetings[0].doctor.user.name}
            </span>
          </h2>
          <div className="flex flex-col xl:flex-row justify-between items-center my-4">
            <div>
              <h3 className="text-primary font-semibold">CBU / CVU</h3>
              <span>2301230210302130213</span>
            </div>
            <div>
              <h3 className="text-primary font-semibold">Alias</h3>
              <span>GATO.PERRO.LORO</span>
            </div>
          </div>
          <h3 className="text-xl flex items-center gap-4">
            <div className="w-1/2">
              <Autocomplete
                onChange={(event, newValue: any) => {
                  if (newValue) {
                    const { id } = newValue;
                    const m: MeetingResponseDto[] = props.lastMeetings.filter(
                      (meeting: MeetingResponseDto) => {
                        return (
                          id === new Date(meeting.startDatetime).getMonth()
                        );
                      }
                    );
                    setMeetings(m);
                    reset(m);
                    setMonth(Months[id]);
                    setTotal(
                      m
                        .map((m) => +m.price)
                        .reduce((acum, value) => acum + value, 0)
                    );
                  }
                }}
                disablePortal
                options={Months.map((month: string, idx: number) => ({
                  id: idx,
                  label: month,
                }))}
                renderInput={(params: any) => (
                  <Input
                    onChange={() => {}}
                    name="monthId"
                    {...params}
                    label="Mes"
                  />
                )}
              />
            </div>
          </h3>
          <div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <h3 className="text-xl text-primary font-semibold">Mes:</h3>
                <span className="text-xl">{month}</span>
              </div>
              <div className="flex justify-end items-center gap-2 text-primary py-4">
                <FaChevronLeft
                  className="text-2xl hover:cursor-pointer"
                  onClick={() => page !== 1 && paginated()}
                />

                <FaChevronRight
                  className="text-2xl hover:cursor-pointer"
                  onClick={() => page < pages && paginated(true)}
                />
                <p className="text-md">
                  Pagina {page} - {pages}
                </p>
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table aria-label="meetings table">
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
                      Paciente
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
                        Precio
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageMeetings.map((row: any, idx: number) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        {row.user.surname}, {row.user.name}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        {moment(row.startDatetime).format("LLL")}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        {pesos.format(row.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-primary text-center">
            Facturación
          </h2>
          <div className="flex flex-col items-center xl:items-start">
            <h3 className="text-2xl text-primary">Total Recaudado</h3>
            <p className="text-xl">{pesos.format(total)}</p>
          </div>
          <div className="flex flex-col items-center xl:items-start">
            <h3 className="text-2xl text-primary">% de comisión</h3>
            <p className="text-xl">5%</p>
          </div>
          <div className="flex flex-col items-center xl:items-start">
            <h3 className="text-2xl text-primary">Ganancia</h3>
            <p className="text-xl">{pesos.format(total * 0.05)}</p>
          </div>
          <div className="flex flex-col items-center xl:items-start">
            <h3 className="text-2xl text-primary">Total a pagar</h3>
            <p className="text-xl">{pesos.format(total - total * 0.05)}</p>
          </div>
          <div className="flex flex-col items-center xl:items-start">
            <h3 className="text-2xl text-primary">Estado</h3>
            <p className="text-xl">Pendiente de facturación</p>
            <p className="text-xl">Pagada</p>
          </div>
          <Button>Pagar</Button>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { id } = context.query;

    let lastMeetings = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/doctor/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );
    lastMeetings = lastMeetings.data;

    return {
      props: {
        auth,
        lastMeetings,
      },
    };
  },
  { protected: true }
);
