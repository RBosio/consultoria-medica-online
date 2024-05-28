import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import {
  Alert,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
} from "@mui/material";
import { FaCheck, FaUserDoctor, FaXmark } from "react-icons/fa6";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { PRIMARY_COLOR } from "@/constants";
import DatePicker from "@/components/dateInput";
import { pesos } from "@/lib/formatCurrency";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import moment from "moment";
import Input from "@/components/input";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Billing {
  doctor: DoctorResponseDto;
  price: number;
  paid: boolean;
}

interface BillingProps {
  auth: Auth;
  billings: Billing[];
}

export default function Home(props: BillingProps) {
  const theme = useTheme();
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirm, setConfirm] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [billingsMonth, setBillingsMonth] = useState<Billing[]>([]);
  const [billingsFiltered, setBillingsFiltered] = useState<any[]>([]);
  const [name, setName] = useState<string>("");

  const onConfirmClick = async () => {
    await payAll();

    setConfirm(false);
    setMessage("Operaciones registradas como pagadas con éxito");
    setSuccess(true);
  };

  const payAll = async () => {
    const billings = billingsMonth
      .filter((billing) => !billing.paid)
      .map((billing) => billing.doctor.id);
    try {
      if (!month || !year) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/billing`,
          {
            billings,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/billing`,
          {
            billings,
            month,
            year,
          },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );
      }

      setBillingsMonth(
        billingsMonth.map((b) => {
          return {
            ...b,
            paid: true,
          };
        })
      );
      setBillingsFiltered(
        billingsMonth.map((b) => {
          return {
            ...b,
            paid: true,
          };
        })
      );
      setPending(false);
    } catch (error) { }
  };

  useEffect(() => {
    (async () => {
      if (!month) {
        let billings = await axios.get<Billing[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/billing/${new Date().getMonth() + 1
          }/${new Date().getFullYear()}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );

        // setMonth(new Date().getMonth() + 1);
        setBillingsMonth(billings.data);
        setBillingsFiltered(billings.data);
        billings.data.filter((billing: Billing) => !billing.paid).length > 0 &&
          setPending(true);
      } else {
        let billings = await axios.get<Billing[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/billing/${month}/${year}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );

        setBillingsMonth(billings.data);
        setBillingsFiltered(billings.data);
        billings.data.filter((billing: Billing) => !billing.paid).length > 0 &&
          setPending(true);
      }
    })();
  }, [month, year]);

  const filterChange = (name: string) => {
    setBillingsFiltered(
      billingsMonth.filter((b: Billing) =>
        b.doctor.user.name
          .concat(" " + b.doctor.user.surname)
          .toLowerCase()
          .includes(name)
      )
    );
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center">
        <div className="flex flex-col xl:flex-row justify-center gap-4 w-[90%] mt-12">
          <div>
            <SidebarAdmin
              auth={props.auth}
              setSidebarOpened={true}
              sidebarOpened
            />
          </div>
          <div className="bg-white p-4 w-full h-full rounded-lg shadow-lg">
            <div className="flex flex-col-reverse xl:flex-row justify-between items-center gap-4 xl:gap-0 mb-6">
              <div className="flex gap-4 items-center">
                <DatePicker
                  label="Fecha de facturación"
                  name="meetingsDate"
                  views={["year", "month"]}
                  onChange={(date: any) => {
                    setMonth(+moment(new Date(date.$d)).format("MM"));
                    setYear(+moment(new Date(date.$d)).format("YYYY"));
                    setPending(false);
                  }}
                />
                <Button
                  disabled={billingsMonth.length === 0 || !pending}
                  onClick={() => setConfirm(true)}
                  className="h-6/12"
                >
                  Pagar todos
                </Button>
              </div>
              {
                <Chip color={pending ? "error" : "primary"}
                  className="text-white p-2 py-6"
                  icon={pending ? <IoIosCloseCircleOutline size={20} /> : <FaCheck />}
                  label={pending ? "Existen pagos pendientes para este mes" : "No existen pagos pendientes en este mes"} />
              }
            </div>
            <div className="flex justify-between items-center">
              <Input
                name="name"
                value={name}
                variant="outlined"
                placeholder="Buscar profesional..."
                onChange={($e: any) => {
                  setName($e.target.value.toLowerCase());
                  filterChange($e.target.value.toLowerCase());
                }}
                startadornment={
                  <FaUserDoctor color={theme.palette.primary.main} />
                }
                className="my-4"
                label="Médico"
              />
              <div className="flex items-center">
                Pagos pendientes
                <Checkbox
                  onChange={($e) =>
                    $e.target.checked
                      ? (() => {
                        setBillingsFiltered(
                          billingsMonth.filter((billing) => !billing.paid)
                        );
                        setName("");
                      })()
                      : (() => {
                        setBillingsFiltered(billingsMonth);
                        setName("");
                      })()
                  }
                />
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
                      CBU / Alias
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#fff",
                        padding: "1.2rem",
                        fontSize: "1.2rem",
                      }}
                    >
                      Email
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
                        Monto a pagar
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
                      <div className="flex justify-center items-center gap-2">
                        Operaciones
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingsFiltered.length > 0 ? billingsFiltered.map((row: Billing, idx: number) => (
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
                        {row.doctor.user.surname}, {row.doctor.user.name}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        {`${row.doctor.cbu ? row.doctor.cbu : '-'} / ${row.doctor.alias ? row.doctor.alias : '-'}`}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        {row.doctor.user.email}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        {pesos.format(row.price * 0.95)}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        align="center"
                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                      >
                        <>
                          {row.paid ? (
                            <Tooltip title="Pagado">
                              <IconButton>
                                <FaCheck className="text-green-600 size-4" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="No pagado">
                              <IconButton>
                                <FaXmark className="text-red-600 size-4" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip
                            title="Facturación"
                            onClick={() => {
                              if (month && year) {
                                localStorage.setItem(
                                  "monthLocal",
                                  month!.toString()
                                );
                                localStorage.setItem(
                                  "yearLocal",
                                  year!.toString()
                                );
                              }
                              router.push(
                                `/admin/billing/${row.doctor.user.id}`
                              );
                            }}
                          >
                            <IconButton className="p-0">
                              <img src="/billing.svg" className="size-6" />
                            </IconButton>
                          </Tooltip>
                        </>
                      </TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} align="center">No se encontraron resultados</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
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
            {confirm ? "Facturación" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea establecer como pagadas todas las operaciones de este mes?"
                : ""}
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
    let billings = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/benefit`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    billings = billings.data;

    return {
      props: {
        auth,
        billings: [],
      },
    };
  },
  { protected: true }
);
