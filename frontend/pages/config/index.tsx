import React, { useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Avatar from "@/components/avatar";
import {
  FaCertificate,
  FaCheck,
  FaCircleInfo,
  FaCircleUp,
  FaCircleXmark,
  FaLocationDot,
  FaMoneyBill1Wave,
  FaPhone,
  FaPlus,
  FaStopwatch,
  FaSuitcaseMedical,
  FaUserDoctor,
  FaXmark,
} from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import Button from "@/components/button";
import {
  Alert,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
  Select,
  Snackbar,
  useTheme,
} from "@mui/material";
import { UserResponseDto } from "@/components/dto/user.dto";
import { useRouter } from "next/router";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import Rate from "@/components/rate";
import { GoDotFill } from "react-icons/go";
import { IoMdMail } from "react-icons/io";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import { ScheduleResponseDto } from "@/components/dto/schedule.dto";
import Input from "@/components/input";
import { useFormik } from "formik";
import { HealthInsuranceResponseDto } from "@/components/dto/healthInsurance.dto";
import Link from "next/link";
import { NotificationResponseDto } from "@/components/dto/notification.dto";

interface ConfigProps {
  user: UserResponseDto;
  doctor: DoctorResponseDto;
  schedules: ScheduleResponseDto[];
  healthInsurances: HealthInsuranceResponseDto[];
  notification: NotificationResponseDto;
  auth: Auth;
  token: string;
}

export default function Config(props: ConfigProps) {
  const theme = useTheme();
  const router = useRouter();
  const days = [
    {
      day: -1,
      d: "",
    },
    {
      day: 1,
      d: "Lunes",
    },
    {
      day: 2,
      d: "Martes",
    },
    {
      day: 3,
      d: "Miercoles",
    },
    {
      day: 4,
      d: "Jueves",
    },
    {
      day: 5,
      d: "Viernes",
    },
    {
      day: 6,
      d: "Sabado",
    },
    {
      day: 0,
      d: "Domingo",
    },
  ];

  const [modify, setModify] = useState(false);
  const [minutesFrom, setMinutesFrom] = useState([
    "",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "24:00",
  ]);
  const [minutesTo, setMinutesTo] = useState<string[]>([]);
  const [healthInsurance, setHealthInsurance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(
    props.doctor.durationMeeting
  );
  const [day, setDay] = useState<number>(-1);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [confirmSchedule, setConfirmSchedule] = useState<boolean>(false);
  const [confirmUpdate, setConfirmUpdate] = useState<boolean>(false);
  const [confirmVerification, setConfirmVerification] =
    useState<boolean>(false);

  const updateForm = useFormik({
    initialValues: {
      durationMeeting: duration,
      priceMeeting: props.doctor.priceMeeting,
      phone: props.doctor.user.phone,
      address: props.doctor.address,
    },
    onSubmit: async (values, { setSubmitting }) => {
      values.durationMeeting = duration;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${props.doctor.user.dni}`,
        values,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctor/${props.doctor.id}`,
        values,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setModify(false);

      setMessage("Datos actualizados correctamente!");
      setSuccess(true);
      router.push(`/config`);
    },
  });

  const addScheduleForm = useFormik({
    initialValues: {
      day: 0,
      start_hour: 0,
      end_hour: 0,
      doctorId: props.doctor.id,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (day && from && to) {
        values.day = day;
        values.start_hour = Number(from);
        values.end_hour = Number(to);
      }

      try {
        if (values.end_hour != 0) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/schedule`,
            values,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${props.auth.token}` },
            }
          );

          setMessage("Rango horario agregado con éxito!");
          setSuccess(true);

          setDay(-1);
          setFrom("");
          setTo("");
        }
      } catch (e: any) {
        setMessage(e.response.data.message);
        setError(true);
      }

      router.push(`/config`);
    },
  });

  const handleChange = ($e: any) => {
    setMinutesTo(
      minutesFrom
        .map((m) => m.split(":")[0])
        .filter((m) => m > $e.target.value)
        .map((m) => m.concat(":00"))
    );

    setFrom($e.target.value);
  };

  const handleClickHealthInsurance = async () => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${props.doctor.user.dni}`,
      {
        healthInsurance,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    router.push("/config");
  };

  const onConfirmClick = () => {
    if (confirmSchedule) {
      addScheduleForm.handleSubmit();
      setConfirmSchedule(false);
    } else if (confirmUpdate) {
      updateForm.handleSubmit();
      setConfirmUpdate(false);
    } else {
      handleClickVerification();
      setConfirmVerification(false);
    }
  };

  const handleClickVerification = async () => {
    const user = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/admin`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notification`,
      {
        userIdSend: props.auth.id,
        userIdReceive: user.data.id,
        type: "verification",
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Solicitud realizada con éxito!");
    setSuccess(true);

    router.push("/config");
  };

  return (
    <Layout auth={props.auth}>
      <section className="h-full flex p-8 overflow-scroll lg:overflow-hidden">
        <div className="w-full flex flex-col items-center lg:flex-row gap-6 mt-[3rem]">
          <div className="rounded-md md:w-[calc(100%-15rem)] xl:shadow-md bg-white relative">
            <Avatar
              labelProps={{ className: "hidden" }}
              name={props.doctor.user.name}
              surname={props.doctor.user.surname}
              rootClassName="absolute top-[-4rem] left-1/2 translate-x-[-50%]"
              className="bg-primary"
              size={130}
              icon={<FaUserDoctor size={60} />}
              photo={
                props.doctor.user.image ? props.doctor.user.image : undefined
              }
            />
            <div className="mt-20">
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

                <div className="w-full p-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-primary text-xl text-center">
                      Descripción
                    </h2>
                    <p className="text-justify">{props.doctor.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-primary text-xl text-center">
                      Datos de Contacto
                    </h2>
                    <div className="flex flex-col gap-2 items-center">
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
                            .map((hi) => hi.name)
                            .join(" | ")}
                        </p>
                      </div>
                      <div className="flex gap-2 text-primary items-center font-bold">
                        <FaLocationDot size={15} />
                        <p className="text-secondary">{props.doctor.address}</p>
                      </div>
                      <Button
                        startIcon={<FaEdit />}
                        onClick={() => setModify(!modify)}
                      >
                        Modificar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden min-w-[70%]">
            <div
              className={`flex flex-nowrap items-center transition-all ease-in duration-500 ${
                modify ? "-translate-x-full" : ""
              }`}
            >
              <div className="bg-white min-w-full rounded-md shadow-md p-4 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-8">
                  <div className="w-1/3 p-4">
                    <h3 className="text-primary text-xl text-center">
                      Reunion
                    </h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-primary text-lg flex justify-center items-center gap-2">
                          <FaStopwatch /> Duracion
                        </h4>
                        <p>{props.doctor.durationMeeting} min</p>
                      </div>
                      <div>
                        <h4 className="text-primary text-lg flex justify-center items-center gap-2">
                          <FaMoneyBill1Wave /> Precio
                        </h4>
                        <p>{props.doctor.priceMeeting} AR$</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-[112px] w-1 border-l-2 border-primary"></div>
                  <div className="p-4 w-2/3">
                    <h3 className="text-primary text-xl text-center">
                      Verificacion
                    </h3>
                    <div className="flex justify-between items-center">
                      {props.doctor.verified ? (
                        <div>
                          <h3 className="text-primary text-lg flex items-center gap-2">
                            <FaCheck /> Verificado
                          </h3>
                          <p>desde 2023-01-25</p>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-primary text-lg flex items-center gap-2">
                            <FaXmark /> No verificado
                          </h3>
                          <p>
                            {props.notification
                              ? "Solicitud en curso, aguarde a que un administrador revise su peticion"
                              : "Solicite verificacion para comenzar a operar"}
                          </p>
                        </div>
                      )}
                      <Button
                        className="min-w-60 ml-2"
                        sx={{
                          "&.MuiButton-contained": {
                            background: "#06AC06",
                            color: "#fff",
                          },
                        }}
                        onClick={() => setConfirmVerification(true)}
                        disabled={
                          props.doctor.verified || props.notification
                            ? true
                            : false
                        }
                        startIcon={<FaCertificate />}
                      >
                        Solicitar verificacion
                      </Button>
                    </div>
                  </div>
                </div>
                <Divider
                  variant="middle"
                  sx={{
                    "&": {
                      width: "90%",
                    },
                    "&::before, &::after": {
                      borderTop: `thin solid ${theme.palette.primary.main}`,
                    },
                  }}
                  className="mx-auto my-4"
                >
                  <GoDotFill color={theme.palette.primary.main} />
                </Divider>
                <div className="p-4">
                  <h3 className="text-primary text-xl text-center">
                    Plan actual
                  </h3>
                  <div
                    className={`bg-secondary flex justify-between items-center text-white px-8 py-2 mt-2 rounded-md ${robotoBold.className}`}
                  >
                    <div className="flex justify-between w-1/2">
                      <p>Plan 1</p>
                      <p>Miembro desde 2020-01-14</p>
                    </div>
                    <ButtonGroup>
                      <Link href={"/plan"}>
                        <Button startIcon={<FaCircleUp />} color="info">
                          Actualizar
                        </Button>
                      </Link>
                      <Button
                        sx={{
                          "&.MuiButton-contained": {
                            background: "#AC0606",
                            color: "#fff",
                          },
                        }}
                        startIcon={<FaCircleXmark />}
                      >
                        Cancelar
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
                <Divider
                  variant="middle"
                  sx={{
                    "&": {
                      width: "90%",
                    },
                    "&::before, &::after": {
                      borderTop: `thin solid ${theme.palette.primary.main}`,
                    },
                  }}
                  className="mx-auto my-4"
                >
                  <GoDotFill color={theme.palette.primary.main} />
                </Divider>
                <div className="p-4">
                  <h3 className="text-primary text-xl text-center">
                    Rangos horarios
                  </h3>
                  <div className="flex items-center">
                    <form
                      className="w-full flex justify-between items-center my-4 gap-4"
                      onSubmit={($e: any) => {
                        $e.preventDefault();
                        setConfirmSchedule(true);
                      }}
                    >
                      <div className="my-4">
                        <p className="text-primary text-xl">Dia</p>
                      </div>
                      <Select
                        className="w-1/4"
                        value={day}
                        onChange={($e: any) => setDay($e.target.value)}
                      >
                        {days.map((d) => (
                          <MenuItem key={d.day} value={d.day}>
                            {d.d}
                          </MenuItem>
                        ))}
                      </Select>
                      <div className="my-4">
                        <p className="text-primary text-xl">Desde</p>
                      </div>
                      <Select
                        className="w-1/4"
                        value={from}
                        onChange={handleChange}
                      >
                        {minutesFrom.map((m, idx) => {
                          return (
                            <MenuItem key={idx} value={m.split(":")[0]}>
                              {m}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <div className="">
                        <p className="text-primary text-xl">Hasta</p>
                      </div>
                      <Select
                        className="w-1/4"
                        value={to}
                        onChange={($e: any) => setTo($e.target.value)}
                      >
                        {minutesTo.map((m, idx) => {
                          return (
                            <MenuItem key={idx} value={m.split(":")[0]}>
                              {m}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <Button type="submit" startIcon={<FaPlus />}>
                        Agregar
                      </Button>
                    </form>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="mt-8">
                      <div className="my-4">
                        <p className="text-primary text-xl">Desde</p>
                      </div>
                      <div className="">
                        <p className="text-primary text-xl">Hasta</p>
                      </div>
                    </div>
                    {days.map((day, idx) => {
                      return (
                        <div key={idx}>
                          {day.day >= 0 ? (
                            <p className="text-primary text-xl border-y-2 border-primary px-10 py-2">
                              {day.d}
                            </p>
                          ) : (
                            ""
                          )}
                          <div className="flex justify-center items-center">
                            {props.schedules.map((s) => {
                              if (s.day === day.day) {
                                return (
                                  <div
                                    className="bg-primary text-xl text-white m-1 my-2 rounded-md border border-slate-600"
                                    key={s.id}
                                  >
                                    <p className="text-center p-2 border-b border-slate-600">
                                      {s.start_hour < 10
                                        ? "0".concat(s.start_hour.toString())
                                        : s.start_hour}
                                    </p>
                                    <p className="text-center p-2">
                                      {s.end_hour < 10
                                        ? "0".concat(s.end_hour.toString())
                                        : s.end_hour}
                                    </p>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="bg-white min-w-full rounded-md shadow-md p-4 flex flex-col justify-center">
                <form
                  onSubmit={($e: any) => {
                    $e.preventDefault();
                    setConfirmUpdate(true);
                  }}
                >
                  <div className="flex justify-between items-start gap-8">
                    <div className="w-1/3 p-4">
                      <h3 className="text-primary text-xl text-center">
                        Reunion
                      </h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-primary text-lg flex justify-center items-center gap-2">
                            <FaStopwatch /> Duracion
                          </h4>
                          <Select
                            className="w-full"
                            value={duration}
                            onChange={($e: any) => setDuration($e.target.value)}
                          >
                            {[10, 15, 30, 45, 60].map((d, idx) => (
                              <MenuItem key={idx} value={d}>
                                {d} min
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <h4 className="text-primary text-xl flex justify-center items-center gap-2">
                            <FaMoneyBill1Wave /> Precio
                          </h4>
                          <div className="flex items-center">
                            <Input
                              className="w-28"
                              type="text"
                              name="priceMeeting"
                              onChange={updateForm.handleChange}
                              onBlur={updateForm.handleBlur}
                              value={updateForm.values.priceMeeting}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h-[144px] w-1 border-l-2 border-primary"></div>
                    <div className="p-4 w-2/3">
                      <h3 className="text-primary text-xl text-center">
                        Datos personales
                      </h3>
                      <div className="flex justify-between items-center mt-[12px]">
                        <div>
                          <h4 className="text-primary text-xl flex items-center gap-2">
                            <FaPhone /> Telefono
                          </h4>
                          <Input
                            type="text"
                            name="phone"
                            onChange={updateForm.handleChange}
                            onBlur={updateForm.handleBlur}
                            value={updateForm.values.phone}
                          />
                        </div>
                        <div>
                          <h4 className="text-primary text-xl flex items-center gap-2">
                            <FaLocationDot /> Direccion de consultorio
                          </h4>
                          <Input
                            type="text"
                            name="address"
                            onChange={updateForm.handleChange}
                            onBlur={updateForm.handleBlur}
                            value={updateForm.values.address}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button type="submit">Guardar cambios</Button>
                  </div>
                </form>
                <Divider
                  variant="middle"
                  sx={{
                    "&": {
                      width: "90%",
                    },
                    "&::before, &::after": {
                      borderTop: `thin solid ${theme.palette.primary.main}`,
                    },
                  }}
                  className="mx-auto my-4"
                >
                  <GoDotFill color={theme.palette.primary.main} />
                </Divider>
                <h3 className="text-primary text-xl text-center">
                  Obras sociales
                </h3>
                <div className="flex justify-between items-center p-4">
                  <div className="w-1/3">
                    <Select
                      className="w-2/3 mr-2"
                      onChange={($e: any) =>
                        setHealthInsurance($e.target.value)
                      }
                    >
                      {props.healthInsurances
                        .filter(
                          (hi) =>
                            !props.doctor.user.healthInsurances
                              .map((hi) => hi.id)
                              .includes(hi.id)
                        )
                        .map((hi: HealthInsuranceResponseDto) => (
                          <MenuItem key={hi.id} value={hi.id}>
                            {hi.name}
                          </MenuItem>
                        ))}
                    </Select>
                    <Button onClick={handleClickHealthInsurance}>
                      Agregar
                    </Button>
                  </div>
                  <div className="w-2/3 flex justify-center flex-wrap gap-2">
                    {props.doctor.user.healthInsurances.map((hi) => {
                      return (
                        <div
                          key={hi.id}
                          className="flex items-center gap-2 p-2 bg-primary text-white rounded-md"
                        >
                          <FaCheckCircle />
                          <p>{hi.name}</p>
                          <FaXmark className="hover:cursor-pointer hover:text-slate-300" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Dialog
            open={confirmSchedule || confirmUpdate || confirmVerification}
            onClose={() => {
              setConfirmSchedule(false);
              setConfirmUpdate(false);
              setConfirmVerification(false);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" className="text-center">
              {confirmSchedule
                ? "Rango horario"
                : confirmUpdate
                ? "Datos personales"
                : "Verificacion"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {confirmSchedule
                  ? "¿Desea agregar el rango horario?"
                  : confirmUpdate
                  ? "¿Desea actualizar los datos?"
                  : "¿Desea solicitar la verificacion de la cuenta?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="text"
                onClick={() => {
                  setConfirmSchedule(false);
                  setConfirmUpdate(false);
                  setConfirmVerification(false);
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
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let d = await axios.get<DoctorResponseDto>(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor/user/${auth?.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    const doctor = d.data;

    let s = await axios.get<ScheduleResponseDto[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/schedule/${doctor.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    const schedules = s.data;

    let healthInsurances = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    healthInsurances = healthInsurances.data;

    let notification = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/verification/${auth?.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    notification = notification.data;

    return {
      props: {
        doctor,
        schedules: schedules.slice(1).concat(schedules.splice(0, 1)),
        healthInsurances,
        notification,
        auth,
      },
    };
  },
  {protected: true, role: "doctor"}
);
