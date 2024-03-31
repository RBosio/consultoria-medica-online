import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import React, { useEffect, useState } from "react";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Avatar from "@/components/avatar";
import { FaUserDoctor } from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import {
  Alert,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Rate from "@/components/rate";
import { useTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { FaPhone, FaSuitcaseMedical, FaLocationDot } from "react-icons/fa6";
import { IoIosPricetag, IoMdMail } from "react-icons/io";
import { IoTimeSharp } from "react-icons/io5";
import { CiDiscount1 } from "react-icons/ci";
import Button from "@/components/button";
import { useRouter } from "next/router";

export default function Doctor(props: any) {
  const theme = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [confirmTurn, setConfirmTurn] = useState(false);
  const [meetingError, setMeetingError] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>();
  const [mp, setMP] = useState<any>();

  useEffect(() => {
    const initMP = async () => {
      const MP = await import("@mercadopago/sdk-react");
      setMP(MP);
      return MP;
    };

    initMP().then((res) => {
      res.initMercadoPago("TEST-42764678-3204-404e-8181-56af419d0dcc");
    });
  }, []);

  const handleDateChange = (
    event: React.MouseEvent<HTMLElement>,
    newDate: any
  ) => {
    setSelectedDate(newDate);
  };

  const getFormattedSelectedDate = () => {
    if (!selectedDate) return { day: "", time: "" };
    const selectedDateObj = props.doctorAvailability.filter(
      (da: any) => da.date === selectedDate.split("T")[0]
    )[0];
    let day = selectedDateObj.formattedDate;
    day = day.charAt(0).toUpperCase() + day.slice(1);
    return { day, time: selectedDate.split("T")[1].slice(0, -3) };
  };

  const onConfirmClick = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/create-preference`,
        {
          startDatetime: selectedDate,
          doctorId: router.query.id,
          price: props.doctor.priceMeeting,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      const { id } = response.data;
      setPreferenceId(id);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting`,
        {
          startDatetime: selectedDate,
          doctorId: router.query.id,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
    } catch (error) {
      setMeetingError(true);
    }
  };

  const getDiscount = () => {
    if (!props.user.validateHealthInsurance) return null;

    const doctorsWorkingFor = props.doctor.user.healthInsurances;
    const userHealthInsurance = props.user.healthInsurances[0];

    if (!userHealthInsurance) return null;

    const foundHealthInsurance = doctorsWorkingFor.filter(
      (hi: any) => hi.id === userHealthInsurance.id
    );

    return foundHealthInsurance[0] ?? null;
  };

  const pesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <Layout auth={props.auth}>
      <section className="flex overflow-y-auto xl:p-8">
        I
        <div className="flex flex-col xl:flex-row xl:gap-6 xl:mt-[3rem]">
          <div className="bg-white shrink-0 relative xl:rounded-md xl:shadow-md xl:w-4/12">
            <Avatar
              labelProps={{ className: "hidden xl:hidden" }}
              name={props.doctor.user.name}
              surname={props.doctor.user.surname}
              rootClassName="absolute top-[2rem] xl:top-[-4rem] left-1/2 translate-x-[-50%]"
              className="bg-primary"
              size={130}
              icon={<FaUserDoctor size={60} />}
              photo={
                props.doctor.user.image ? props.doctor.user.image : undefined
              }
            />
            <div className="mt-[11rem] xl:mt-20 bg-white">
              <div className="flex flex-col items-center gap-3">
                <h2
                  className={`text-primary text-center ${robotoBold.className} text-3xl`}
                >
                  {props.doctor.user.name} {props.doctor.user.surname}
                </h2>
                <div className="flex gap-2">
                  {props.doctor.specialities.map((spec: any) => (
                    <Chip
                      key={spec.id}
                      size="small"
                      variant="outlined"
                      color="primary"
                      label={spec.name}
                    />
                  ))}
                </div>
                <Rate rate={Number(props.doctor.avgRate)} />
                <Divider
                  variant="middle"
                  sx={{
                    "&": {
                      width: "70%",
                    },
                    "&::before, &::after": {
                      borderTop: `thin solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <GoDotFill color={theme.palette.primary.main} />
                </Divider>
                <div className="p-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-primary text-xl">Descripción</h2>
                    <p className="line-clamp-[10]">
                      {props.doctor.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-primary text-xl">Datos de Contacto</h2>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 text-primary items-center font-bold">
                        <IoMdMail size={15} />
                        <p className="text-secondary">
                          {props.doctor.user.email}
                        </p>
                      </div>
                      <div className="flex gap-2 text-primary items-center font-bold">
                        <FaPhone size={15} />
                        <p className="text-secondary">
                          {props.doctor.user.phone}
                        </p>
                      </div>
                      <div className="flex gap-2 text-primary items-center font-bold">
                        <FaSuitcaseMedical size={15} />
                        <p className="text-secondary">
                          {props.doctor.user.healthInsurances
                            .map((hi: any) => hi.name)
                            .join(" | ")}
                        </p>
                      </div>
                      <div className="flex gap-2 text-primary items-center font-bold">
                        <FaLocationDot size={15} />
                        <p className="text-secondary">{props.doctor.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:hidden bg-white flex justify-center">
            <Divider
              variant="middle"
              sx={{
                "&": {
                  width: "70%",
                  margin: "1rem 0",
                },
                "&::before, &::after": {
                  borderTop: `thin solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <GoDotFill color={theme.palette.primary.main} />
            </Divider>
          </div>
          <div className="flex flex-col bg-white p-4 gap-2 shadow-md grow xl:rounded-md relative">
            <div className="w-full h-32 flex items-center justify-center bg-primary absolute right-0 top-0 xl:w-56 xl:h-56 xl:rounded-tr-md">
              <span className="hidden xl:block absolute bottom-0 w-0 h-0 border-x-solid border-x-transparent border-x-[7rem] border-b-[3rem] border-b-solid border-b-white" />
              <div className="flex flex-col text-white w-full h-full py-2">
                <div className="flex items-center gap-1 px-2 pb-1 rounded-tr-md border-b-[1px] border-white">
                  <IoIosPricetag />
                  <h2>CONSULTA</h2>
                </div>
                <div className="flex flex-col gap-1 grow items-center justify-center xl:mb-5">
                  {Boolean(getDiscount()) ? (
                    <div className="flex gap-1 items-center">
                      <p className={`text-lg text-primary_light line-through`}>
                        {pesos.format(props.doctor.priceMeeting)}
                      </p>
                      <Chip
                        className="mx-1 border-white text-white"
                        size="small"
                        variant="outlined"
                        icon={<CiDiscount1 size={20} color="#ffffff" />}
                        label={`${Math.floor(
                          Number(getDiscount().discount) * 100
                        )}% (${getDiscount().name})`}
                      />
                    </div>
                  ) : null}
                  <p className={`text-3xl ${robotoBold.className}`}>
                    {getDiscount()
                      ? pesos.format(
                          props.doctor.priceMeeting *
                            (1 - Number(getDiscount().discount))
                        )
                      : pesos.format(props.doctor.priceMeeting)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[7.7rem] flex gap-2 items-center mb-2 xl:mt-0">
              <IoTimeSharp size={20} color={theme.palette.primary.main} />
              <h2 className={`text-primary text-2xl ${robotoBold.className}`}>
                Solicitar Turno
              </h2>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4">
                {props.doctorAvailability.map((da: any) => {
                  let [day, date] = da.formattedDate.split(", ");
                  day = day.charAt(0).toUpperCase() + day.slice(1);
                  return (
                    <div key={da.date}>
                      <h2 className={`text-primary text-lg mb-1`}>
                        <span className="font-bold">{day}</span>, {date}
                      </h2>
                      {da.schedule.filter((avSch: any) => avSch.available)
                        .length > 0 ? (
                        <ToggleButtonGroup
                          className="flex-wrap"
                          exclusive
                          onChange={handleDateChange}
                          value={selectedDate}
                          size="small"
                          aria-label="Small sizes"
                        >
                          {da.schedule
                            .filter((avSch: any) => avSch.available)
                            .map((sch: any) => (
                              <ToggleButton
                                sx={{
                                  "&.MuiToggleButton-root , &.MuiToggleButton-root.Mui-disabled, &.MuiToggleButton-root.MuiToggleButtonGroup-grouped":
                                    {
                                      border: `1px solid ${theme.palette.primary.light}`,
                                      transition: "background .2s ease",
                                    },
                                  "&:hover, &.MuiToggleButton-root.Mui-selected:hover":
                                    {
                                      background: theme.palette.primary.light,
                                    },
                                  "&.Mui-disabled": {
                                    background: "#F7F7F7",
                                  },
                                  "&.Mui-selected": {
                                    background: theme.palette.primary.main,
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                  },
                                }}
                                value={`${da.date}T${sch.time}:00`}
                                key={`${da.date}T${sch.time}:00`}
                              >
                                {sch.time}
                              </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                      ) : (
                        <span className="text-red-600">
                          No hay horarios disponibles
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="my-6 flex justify-center items-center xl:-0">
                <Button
                  onClick={() => setConfirmTurn(true)}
                  disabled={!Boolean(selectedDate)}
                  className="w-40"
                >
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={confirmTurn}
          onClose={() => {
            setConfirmTurn(false);
            setPreferenceId(undefined);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            className={`${robotoBold.className} text-primary`}
            id="alert-dialog-title"
          >
            Confirmar turno
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro que deseas sacar el turno para el{" "}
              <b>{getFormattedSelectedDate().day}</b> a las{" "}
              <b>{getFormattedSelectedDate().time}</b>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="text"
              onClick={() => setConfirmTurn(false)}
            >
              Cancelar
            </Button>
            {!preferenceId && (
              <Button onClick={onConfirmClick} autoFocus>
                Confirmar
              </Button>
            )}
            {mp?.Wallet && preferenceId && (
              <mp.Wallet initialization={{ preferenceId }} />
            )}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={meetingError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={4000}
          onClose={() => setMeetingError(false)}
        >
          <Alert elevation={6} variant="filled" severity="error">
            Se ha producido un error al crear la reunión, inténtelo nuevamente
            más tarde
          </Alert>
        </Snackbar>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { query } = context;

    try {
      let doctor = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctor/${query.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      doctor = doctor.data;

      let doctorAvailability = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule/doctor/${query.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      doctorAvailability = doctorAvailability.data;

      let user = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${auth?.dni}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      user = user.data;

      return {
        props: {
          auth,
          doctor,
          doctorAvailability,
          user,
        },
      };
    } catch {
      return {
        props: {
          auth,
        },
      };
    }
  },
  { protected: true }
);
