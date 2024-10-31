import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import React, { useEffect, useState } from "react";
import { Auth } from "../../types";
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
  IconButton,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import Rate from "@/components/rate";
import { useTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { IoIosPricetag } from "react-icons/io";
import { IoTimeSharp } from "react-icons/io5";
import Button from "@/components/button";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/locale/es";
import Message from "@/components/message";
import { pesos } from "@/lib/formatCurrency";
import { UserHealthInsuranceResponseDto } from "@/components/dto/userHealthInsurance.dto";
import { HealthInsuranceResponseDto } from "@/components/dto/healthInsurance.dto";
import { v4 as uuid } from "uuid";
import { MdDiscount } from "react-icons/md";

export default function Doctor(props: any) {
  const theme = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [confirmTurn, setConfirmTurn] = useState(false);
  const [meetingError, setMeetingError] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>();
  const [init, setInit] = useState<string>();
  const [paid, setPaid] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>();
  const [repr, setRepr] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    moment.locale("es");
  }, []);

  useEffect(() => {
    const initMP = async () => {
      const MP = await import("@mercadopago/sdk-react");
      return MP;
    };

    initMP().then((res) => {
      res.initMercadoPago("TEST-e4d600dd-188e-4b56-8f2e-385a4621de19");
    });

    try {
      const payment = async () => {
        const selected = localStorage.getItem("selectedDate");
        if (
          router.query.preference_id &&
          router.query.status === "approved" &&
          selected
        ) {
          let price = null;
          if (getDiscount()) {
            price =
              props.doctor.priceMeeting * (1 - Number(getDiscount().discount));
          } else {
            price = props.doctor.priceMeeting;
          }

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/meeting`,
            {
              startDatetime: selected,
              doctorId: router.query.id,
              price,
              specialityId: props.doctor.specialities[0].id,
              healthInsuranceId: getDiscount()?.id ? getDiscount().id : null,
            },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${props.auth.token}` },
            }
          );

          await showDetail(selected);
          localStorage.removeItem("selectedDate");
          router.push("/doctors/" + router.query.id);
        } else if (
          router.query.preference_id &&
          router.query.status === "rejected" &&
          selected
        ) {
          setPaid(true);
        }
      };

      payment();
    } catch (error) {
      console.log(error);
    }
    const dateT: Date = JSON.parse(localStorage.getItem("repr")!);
    setDate(dateT);

    return () => {
      localStorage.removeItem("repr");
    };
  }, []);

  const showDetail = async (selectedDate: string) => {
    try {
      const meeting = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/${props.auth.id}/${selectedDate}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
      setDetail(meeting.data);

      setPaid(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notification`,
        {
          userIdSend: props.auth.id,
          userIdReceive: props.doctor.user.id,
          meetingUserId: props.auth.id,
          meetingStartDatetime: selectedDate,
          type: "meeting",
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (
    event: React.MouseEvent<HTMLElement>,
    newDate: any
  ) => {
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate);
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
    if (!repr) {
      try {
        let price = null;
        if (getDiscount()) {
          price =
            props.doctor.priceMeeting * (1 - Number(getDiscount().discount));
        } else {
          price = props.doctor.priceMeeting;
        }

        const idempotencyKey = uuid();

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/meeting/create-preference/${router.query.id}`,
          {
            startDatetime: selectedDate,
            doctorId: router.query.id,
            price,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${props.auth.token}`,
              "Content-Type": "application/json",
              "X-Idempotency-Key": idempotencyKey,
            },
          }
        );

        const { id, init } = response.data;
        setPreferenceId(id);
        setInit(init);
      } catch (error) {
        setMessage(
          "Se ha producido un error al crear la reunión, inténtelo nuevamente más tarde"
        );
        setMeetingError(true);
      }
    } else {
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/meeting/repr/${props.auth.id
          }/${moment(date).format("YYYY-MM-DDTHH:mm:ss")}`,
          {
            startDatetime: selectedDate,
          },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/notification`,
          {
            userIdSend: props.auth.id,
            userIdReceive: props.doctor.user.id,
            type: "rdatetime",
            mStartDOld: moment(date).format("YYYY-MM-DDTHH:mm:ss"),
            mStartDNew: selectedDate,
            meetingUserId: props.auth.id,
            meetingStartDatetime: moment(selectedDate).format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
          },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${props.auth.token}` },
          }
        );

        router.push(
          `/meetings/${btoa(
            props.auth.id +
            "." +
            moment(new Date(selectedDate)).format("YYYY-MM-DDTHH:mm:ss")
          )}`
        );
      } catch (error: any) {
        setMessage(error.response.data.message);
        setMeetingError(true);
      } finally {
        localStorage.removeItem("repr");
        setRepr(false);
        setDate(undefined);
      }
    }
  };

  const getMax = (foundHealthInsurance: HealthInsuranceResponseDto[]) => {
    let max = foundHealthInsurance[0];
    foundHealthInsurance.forEach((hi: HealthInsuranceResponseDto) => {
      if (Number(hi.discount) > Number(max.discount)) {
        max = hi;
      }
    });

    return max;
  };

  const getDiscount = (): HealthInsuranceResponseDto => {
    const foundHealthInsurance = props.user.healthInsurances
      .filter((hi: UserHealthInsuranceResponseDto) =>
        props.doctor.user.healthInsurances
          .map((h: any) => h.healthInsuranceId)
          .includes(hi.healthInsurance.id)
      )
      .map((hi: UserHealthInsuranceResponseDto) => hi.healthInsurance);

    return getMax(foundHealthInsurance);
  };

  return (
    <Layout auth={props.auth}>
      <section className="flex overflow-y-auto xl:p-8">
        <div className="flex flex-col xl:flex-row xl:gap-6 xl:mt-[3rem] w-full">
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
                  <div className="flex flex-col items-center gap-2">
                    <h2 className="text-primary text-xl">Descripción</h2>
                    <p
                      className={`text-justify line-clamp-[8] ${!props.doctor.description &&
                        "text-red-400 font-semibold"
                        }`}
                    >
                      {props.doctor.description ||
                        "El profesional no posee descripción"}
                    </p>
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
          {!paid ? (
            <div className="flex flex-col bg-white p-4 gap-2 shadow-md grow xl:rounded-md relative">
              {!date && <div className="w-full h-32 flex items-center justify-center bg-primary absolute right-0 top-0 xl:w-56 xl:h-56 xl:rounded-tr-md">
                <span className="hidden xl:block absolute bottom-0 w-0 h-0 border-x-solid border-x-transparent border-x-[7rem] border-b-[3rem] border-b-solid border-b-white" />
                <div className="flex flex-col text-white w-full h-full py-2">
                  <div className="flex items-center gap-1 px-2 pb-1 rounded-tr-md border-b-[1px] border-white">
                    <IoIosPricetag />
                    <h2>CONSULTA</h2>
                  </div>
                  <div className="flex flex-col gap-1 grow items-center justify-center xl:mb-5">
                    {Boolean(getDiscount()) ? (
                      <div className="flex items-center">
                        <p
                          className={`text-lg text-primary_light line-through`}
                        >
                          {pesos.format(props.doctor.priceMeeting)}
                        </p>
                        <Tooltip title={`${Math.floor(
                          Number(getDiscount().discount) * 100
                        )}% (${getDiscount().name})`}>
                          <IconButton disableTouchRipple>
                            <MdDiscount color="#ffffff" />
                          </IconButton>
                        </Tooltip>
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
              </div>}
              <div className="mt-[9rem] flex gap-2 items-center mb-2 xl:mt-0">
                <IoTimeSharp size={20} color={theme.palette.primary.main} />
                <h2 className={`text-primary text-2xl ${robotoBold.className}`}>
                  {!date ? 'Solicitar Turno' : 'Reprogramar turno'}
                </h2>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex flex-col gap-4 w-full xl:w-[calc(100%-224px)]">
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
                {props.doctorAvailability.length > 0 ? (
                  <div className="my-6 flex justify-center items-center">
                    {!date ? (
                      <Button
                        onClick={() => {
                          setConfirmTurn(true);
                          onConfirmClick();
                        }}
                        disabled={!Boolean(selectedDate)}
                        className="w-40"
                      >
                        Aceptar
                      </Button>
                    ) : (
                      <Button
                        disabled={!Boolean(selectedDate)}
                        onClick={() => setRepr(true)}
                        className="w-40"
                      >
                        Reprogramar
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2 mt-36">
                    <span className="text-red-600 text-2xl">
                      No hay horarios disponibles
                    </span>
                    <Button onClick={() => router.push("/doctors")}>
                      Regresar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : detail ? (
            <Message
              title="Operación realizada con éxito"
              message={[
                "Su reunión fue programada para el día ",
                <span className="text-primary font-bold">
                  {moment(detail.startDatetime).format("LLLL")}
                </span>,
              ]}
              buttonText="Ir a la reunión"
              handleClick={() =>
                router.push(
                  `/meetings/${btoa(
                    props.auth.id +
                    "." +
                    moment(detail.startDatetime).format("YYYY-MM-DDTHH:mm:ss")
                  )}`
                )
              }
            />
          ) : (
            <Message
              title="Ha ocurrido un error"
              message={"Su reunión no ha podido ser programada"}
              buttonText="Regresar"
              error={true}
              handleClick={() => {
                setPaid(false);
                router.push("/doctors/" + router.query.id);
              }}
            />
          )}
        </div>
        <Dialog
          open={confirmTurn || repr}
          onClose={() => {
            setConfirmTurn(false);
            setPreferenceId(undefined);
            setRepr(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            className={`${robotoBold.className} text-primary`}
            id="alert-dialog-title"
          >
            {confirmTurn
              ? "Confirmar turno"
              : repr
                ? "Reprogramar reunión"
                : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirmTurn ? (
                <>
                  ¿Estás seguro que deseas sacar el turno para el{" "}
                  <b>{getFormattedSelectedDate().day}</b> a las{" "}
                  <b>{getFormattedSelectedDate().time}</b>?
                </>
              ) : repr ? (
                <>
                  ¿Estás seguro que deseas reprogramar la reunión del día{" "}
                  {moment(date).format("LLLL")} al{" "}
                  <b>{moment(selectedDate).format("LLLL")}</b>?
                </>
              ) : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="text"
              onClick={() => {
                setConfirmTurn(false);
                setPreferenceId(undefined);
                setRepr(false);
              }}
            >
              Cancelar
            </Button>
            {repr ? (
              <Button onClick={onConfirmClick} autoFocus>
                Confirmar
              </Button>
            ) : (
              <Button href={init} autoFocus>
                Confirmar
              </Button>
            )}
            {/* {mp?.Wallet && preferenceId && (
              <mp.Wallet initialization={{ preferenceId }} />
            )} */}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={meetingError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={4000}
          onClose={() => setMeetingError(false)}
        >
          <Alert elevation={6} variant="filled" severity="error">
            {message}
          </Alert>
        </Snackbar>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    if (auth!.role === "doctor") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

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
  { protected: true, roles: ['user', 'admin'] }
);
