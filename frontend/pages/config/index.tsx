import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../types";
import axios from "axios";
import Avatar from "@/components/avatar";
import {
  FaBuildingColumns,
  FaChevronRight,
  FaCircleUp,
  FaCircleXmark,
  FaMoneyBill1Wave,
  FaMoneyBillTransfer,
  FaPlus,
  FaStopwatch,
  FaTrash,
  FaUserDoctor,
} from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import Button from "@/components/button";
import {
  Alert,
  Autocomplete,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
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
import { FaEdit } from "react-icons/fa";
import { ScheduleResponseDto } from "@/components/dto/schedule.dto";
import Input from "@/components/input";
import { useFormik } from "formik";
import { HealthInsuranceResponseDto } from "@/components/dto/healthInsurance.dto";
import Link from "next/link";
import { NotificationResponseDto } from "@/components/dto/notification.dto";
import moment from "moment";
import "moment/locale/es";
import { pesos } from "@/lib/formatCurrency";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { validCBU } from "@/lib/cbuValidator";
import { IoIosArrowDropup, IoMdClose } from "react-icons/io";
import { MdAutorenew, MdOutlineCancel } from "react-icons/md";

interface ConfigProps {
  user: UserResponseDto;
  doctor: DoctorResponseDto;
  schedules: ScheduleResponseDto[];
  healthInsurances: HealthInsuranceResponseDto[];
  notification: NotificationResponseDto;
  plans: PlanResponseDto[];
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

  const minutesFrom = [
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
  ];


  const [modify, setModify] = useState(false);
  const [minutesTo, setMinutesTo] = useState<string[]>([]);
  const [healthInsurance, setHealthInsurance] = useState<any>({
    id: 0,
    label: "",
  });
  const [duration, setDuration] = useState<number>(
    props.doctor.durationMeeting ?? ""
  );
  const [day, setDay] = useState<number>(-1);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [confirmSchedule, setConfirmSchedule] = useState<boolean>(false);
  const [confirmUpdate, setConfirmUpdate] = useState<boolean>(false);
  const [confirmCancelPlan, setConfirmCancelPlan] = useState<boolean>(false);
  const [confirmDeleteSchedule, setConfirmDeleteSchedule] = useState<any>(null);
  const [confirmHealthInsurance, setConfirmHealthInsurance] =
    useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [hiToDelete, setHiToDelete] = useState<number>(-1);
  const [confirmDeleteHi, setConfirmDeleteHi] = useState<boolean>(false);

  const healthInsurances = props.healthInsurances.filter((hi: any) => {
    return !props.doctor.user.healthInsurances
      .map((h: any) => h.healthInsuranceId)
      .includes(hi.id);
  });

  useEffect(() => {
    moment.locale("es");

    addEventListener("resize", () => {
      setModify(false);
    });

    setDescription(props.doctor.description ?? "");
  }, []);


  const incompleteDoctorData =
    !props.doctor.cbu ||
    !props.doctor.priceMeeting ||
    !props.doctor.durationMeeting;

  const updateForm = useFormik({
    initialValues: {
      durationMeeting: duration,
      priceMeeting: props.doctor.priceMeeting ?? "",
      phone: props.doctor.user.phone ?? "",
      cbu: props.doctor.cbu ?? "",
      alias: props.doctor.alias ?? "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (values.priceMeeting.toString().length === 0) {
        setMessage("Ingrese un valor para el precio de la reunión");
        setError(true);
        return;
      }

      if (!duration) {
        setMessage("Ingrese un valor para la duración de la reunión");
        setError(true);
        return;
      }

      if (values.cbu && !validCBU(values.cbu)) {
        setMessage("CBU inválido");
        setError(true);
        return;
      }

      values.durationMeeting = duration;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${props.doctor.user.id}`,
        values,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctor/${props.doctor.id}`,
        { ...values, description },
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
      if (day > -1 && from && to) {
        values.day = day;
        values.start_hour = Number(from);
        values.end_hour = Number(to);

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
      } else {
        setMessage("Debe cargar todos los datos");
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
    if (!healthInsurance.id) {
      setMessage("Obra social requerida!");
      setError(true);

      return;
    }

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/healthInsurance/${props.doctor.user.id}`,
      {
        healthInsuranceId: healthInsurance.id,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Obra social agregada con éxito!");
    setSuccess(true);
    setHealthInsurance(null);

    router.push("/config");
  };

  const handleClickDeleteSchedule = async () => {

    try {
      let results: any = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/schedule/${confirmDeleteSchedule.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      results = results.data;

      setMessage("Se eliminó el rango horario con éxito");
      setSuccess(true);

      router.push("/config");

    }
    catch {
      setMessage('Se ha producido un error al eliminar el rango horario')
      setError(true);
    }
  };

  const onConfirmClick = () => {
    if (confirmSchedule) {
      addScheduleForm.handleSubmit();
      setConfirmSchedule(false);
    } else if (confirmUpdate) {
      updateForm.handleSubmit();
      setConfirmUpdate(false);
    } else if (confirmCancelPlan) {
      handleClickCancelPlan();
      setConfirmCancelPlan(false);
    } else if (confirmHealthInsurance) {
      handleClickHealthInsurance();
      setConfirmHealthInsurance(false);
    } else if (confirmDeleteHi) {
      handleClickDeleteHi();
      setConfirmDeleteHi(false);
    } else if (confirmDeleteSchedule) {
      handleClickDeleteSchedule();
      setConfirmDeleteSchedule(null);
    }
  };

  const handleClickDeleteHi = async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/user/unsetHI/${hiToDelete}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Obra social eliminada con éxito!");
    setSuccess(true);

    setHiToDelete(-1);

    router.push("/config");
  };

  const handleClickCancelPlan = async () => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor/plan/${props.doctor.id}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Plan cancelado con éxito!");
    setSuccess(true);

    router.push("/config");
  };

  const formatRange = () => {
    let dayStr = moment().day(confirmDeleteSchedule.day).format('dddd');
    dayStr = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);

    const startHour = `${confirmDeleteSchedule.start_hour.toString().padStart(2, '0')}:00hs`;
    const endHour = `${confirmDeleteSchedule.end_hour.toString().padStart(2, '0')}:00hs`;

    return `${dayStr} desde las ${startHour} hasta las ${endHour}`;

  };

  const planExpiration = () => {
    if (!(props.auth.role === "doctor") || !props.doctor.plan) return;
    const lastPayment = moment(props.doctor.planLastPayment);
    const planExpiration = lastPayment.add(1, 'months');

    const diff = moment().diff(planExpiration, 'days');

    // Si luego de un mes del último pago, pasaron más de N días, entonces el plan expirará cuando N = 5, o sea, pasaron 5 días luego
    // de que haya pasado un mes del último pago
    if (diff >= 0) return planExpiration.add(5, 'days');

  };

  return (
    <Layout auth={props.auth}>
      <section className="flex px-8 mt-8">
        <div className="w-full flex flex-col items-center lg:flex-row gap-6 relative">
          <div className="rounded-md w-full bg-white relative lg:h-full shadow-md">
            <Avatar
              labelProps={{ className: "hidden" }}
              name={props.doctor.user.name}
              surname={props.doctor.user.surname}
              rootClassName="absolute top-[-2rem] left-1/2 translate-x-[-50%]"
              className="bg-primary"
              size={130}
              icon={<FaUserDoctor size={60} />}
              photo={
                props.doctor.user.image ? props.doctor.user.image : undefined
              }
            />
            <div className="mt-24">
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
                <Rate
                  rate={Number(props.doctor.avgRate)}
                  count={Number(props.doctor.count)}
                />
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

                <div className="w-full p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2 items-center">
                    <h2 className="text-primary text-xl text-center">
                      Descripción
                    </h2>
                    <p
                      className={`text-justify line-clamp-[8] ${!props.doctor.description &&
                        "text-red-400 font-semibold"
                        }`}
                    >
                      {props.doctor.description || "No posee descripción"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex flex-col items-center">
                        <h4 className="flex gap-2 text-primary items-center font-bold">
                          <FaBuildingColumns /> CBU / CVU
                        </h4>
                        <p>{props.doctor.cbu || "-"}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <h4 className="flex gap-2 text-primary items-center font-bold">
                          <FaMoneyBillTransfer /> Alias
                        </h4>
                        <p>{props.doctor.alias || "-"}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <h4 className="flex gap-2 text-primary items-center font-bold">
                          <FaMoneyBill1Wave size={15} /> Precio de reunión
                        </h4>
                        <p>
                          {props.doctor.priceMeeting
                            ? `${pesos.format(props.doctor.priceMeeting)}`
                            : "-"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <h4 className="flex gap-2 text-primary items-center font-bold">
                          <FaStopwatch size={15} /> Duración de reunión
                        </h4>
                        <p>
                          {props.doctor.durationMeeting
                            ? `${props.doctor.durationMeeting} minutos`
                            : "-"}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <Button
                          className="m-2"
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
          </div>
          <div className="overflow-hidden w-full md:min-w-[70%] lg:h-full">
            <div
              className={`flex flex-col h-full md:flex-row md:flex-nowrap items-center transition-all ease-in duration-500 ${modify ? "-translate-x-full" : ""
                } gap-6`}
            >
              <div className="bg-white w-full h-full rounded-md p-4 flex flex-col">
                <div className="flex flex-col">
                  <h3
                    className={`text-primary text-xl mb-4 ${robotoBold.className}`}
                  >
                    Obras sociales
                  </h3>
                  <div className="mb-4 flex gap-4 items-center">
                    <Autocomplete
                      className={"min-w-32 w-3/12"}
                      value={healthInsurance}
                      onChange={(event, newValue: any) => {
                        setHealthInsurance(newValue);
                      }}
                      disablePortal
                      noOptionsText="Obra social no encontrada"
                      options={healthInsurances.map((hi: any) => ({
                        id: hi.id,
                        label: hi.name,
                      }))}
                      renderInput={(params: any) => (
                        <Input
                          onChange={() => { }}
                          name="healthInsuranceId"
                          variant="outlined"
                          {...params}
                          label="Obra social"
                        />
                      )}
                    />
                    <Button
                      onClick={() => setConfirmHealthInsurance(true)}
                      startIcon={<FaPlus />}
                    >
                      Agregar
                    </Button>
                  </div>
                  {props.doctor.user.healthInsurances.length > 0 ? (
                    props.doctor.user.healthInsurances.map((hi: any) => {
                      return (
                        <div
                          key={hi.healthInsurance.id}
                          className="flex items-center gap-1"
                        >
                          <FaChevronRight className="text-primary text-md size-4" />
                          <p className="text-md">{hi.healthInsurance.name}</p>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setHiToDelete(hi.healthInsurance.id);
                              setConfirmDeleteHi(true);
                            }}
                          >
                            <FaTrash className="text-error" size={15} />
                          </IconButton>
                        </div>
                      );
                    })
                  ) : (
                    <p>
                      Actualmente no estás trabajando para ninguna obra social{" "}
                    </p>
                  )}
                </div>
                <Divider
                  variant="middle"
                  sx={{
                    "&::before, &::after": {
                      borderTop: `thin solid ${theme.palette.primary.main}`,
                    },
                  }}
                  className="w-full mx-auto my-4"
                >
                  <GoDotFill color={theme.palette.primary.main} />
                </Divider>
                <div>
                  <h3
                    className={`text-primary text-xl mb-4 ${robotoBold.className}`}
                  >
                    Plan actual
                  </h3>
                  {planExpiration() &&
                    <Alert className="w-full shadow-md rounded-md mb-4" severity="error">
                      Tu plan expirará el {`${planExpiration()?.format('LLL')}hs`}. Por favor, renueva el mismo para seguir operando
                    </Alert>}
                  {props.auth.role === "doctor" && !props.doctor.plan && (
                    <Alert
                      className="w-full shadow-md rounded-md mb-4"
                      severity="warning"
                    >
                      Para realizar reuniones debes solicitar un plan de trabajo
                    </Alert>
                  )}
                  <div
                    className={`m-auto w-full bg-secondary flex flex-col gap-2 md:gap-0 md:flex-row sm:justify-between items-center text-white px-4 py-2 mt-2 rounded-md`}
                  >
                    <Chip
                      size="medium"
                      variant="filled"
                      color="primary"
                      className={`${robotoBold.className}`}
                      label={
                        props.doctor.plan ? props.doctor.plan.name : "Sin plan"
                      }
                    />
                    <p>
                      {props.doctor.plan
                        ? props.doctor.planSince &&
                        `Miembro desde ${moment(
                          props.doctor.planSince
                        ).format("LL")}`
                        : "Actualmente se encuentra sin plan de trabajo, solicite uno para comenzar"}
                    </p>
                    {props.doctor.plan ? (
                      <ButtonGroup>
                        {planExpiration() && <Link href={`/config/plan/${props.doctor.planId}`}>
                          <Button size="small" startIcon={<MdAutorenew />} color="info">
                            Renovar
                          </Button>
                        </Link>}
                        <Link href={"/config/plan"}>
                          <Button size="small" startIcon={<IoIosArrowDropup />} color="info">
                            {Math.max(...props.plans.map((a) => a.id)) !== props.doctor.plan.id ? 'Actualizar' : 'Modificar'}
                          </Button>
                        </Link>
                        <Button
                          size="small"
                          sx={{
                            "&.MuiButton-contained": {
                              background: "#AC0606",
                              color: "#fff",
                            },
                          }}
                          startIcon={<MdOutlineCancel />}
                          onClick={() => setConfirmCancelPlan(true)}
                        >
                          Cancelar
                        </Button>
                      </ButtonGroup>
                    ) : (
                      <Link href={"/config/plan"}>
                        <Button
                          size="small"
                          startIcon={<FaCircleUp />}
                          color="info"
                          className="mt-4 md:mt-0"
                        >
                          Solicitar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <Divider
                  variant="middle"
                  sx={{
                    "&::before, &::after": {
                      borderTop: `thin solid ${theme.palette.primary.main}`,
                    },
                  }}
                  className="w-full mx-auto my-4"
                >
                  <GoDotFill color={theme.palette.primary.main} />
                </Divider>
                <div>
                  <h3
                    className={`text-primary text-xl mb-4 ${robotoBold.className}`}
                  >
                    Rangos horarios
                  </h3>
                  {props.schedules.length === 0 && (
                    <Alert
                      className="w-full shadow-md rounded-md mb-4"
                      severity="warning"
                    >
                      Para realizar reuniones debes registrar al menos un rango
                      horario
                    </Alert>
                  )}
                  <div className="flex flex-col md:flex-row items-center">
                    <form
                      className="w-full flex flex-col md:flex-row justify-between items-center my-4 gap-4"
                      onSubmit={($e: any) => {
                        $e.preventDefault();
                        setConfirmSchedule(true);
                      }}
                    >
                      <div className="md:my-4">
                        <p className="text-primary text-xl">Día</p>
                      </div>
                      <Select
                        className="w-full md:w-1/4 outline outline-1 outline-primary hover:outline-green-600"
                        value={day}
                        onChange={($e: any) => setDay($e.target.value)}
                      >
                        {days.map((d) => (
                          <MenuItem key={d.day} value={d.day}>
                            {d.d}
                          </MenuItem>
                        ))}
                      </Select>
                      <div className="md:my-4">
                        <p className="text-primary text-xl">Desde</p>
                      </div>
                      <Select
                        className="w-full md:w-1/4 outline outline-1 outline-primary"
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
                        className="w-full md:w-1/4 outline outline-1 outline-primary hover:outline-green-600"
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
                      <Button
                        className="mx-4"
                        type="submit"
                        startIcon={<FaPlus />}
                      >
                        Agregar
                      </Button>
                    </form>
                  </div>
                  <div className="flex mt-2 overflow-x-scroll p-4 w-full">
                    <div className="mt-8">
                      <div className="my-4">
                        <p className="text-primary text-xl">Desde</p>
                      </div>
                      <div className="">
                        <p className="text-primary text-xl">Hasta</p>
                      </div>
                    </div>
                    <div className="flex">
                      {days.map((day, idx) => {
                        return (
                          <div key={idx}>
                            {day.day >= 0 ? (
                              <p className="text-primary text-xl text-center border-y-2 border-primary px-10 py-2">
                                {day.d}
                              </p>
                            ) : (
                              ""
                            )}
                            <div className="flex justify-center items-center mx-4">
                              {props.schedules.map((s) => {
                                return (
                                  <div key={s.id}>
                                    {s.day === day.day ? (
                                      <div className="bg-primary text-xl text-white m-2 my-3 rounded-md border border-slate-600 relative">
                                        <IconButton onClick={() => {
                                          setConfirmDeleteSchedule(s);
                                        }} size="small" className="transition hover:bg-error hover:opacity-75 bg-error absolute top-[-10px] right-[-10px]" color="error">
                                          <IoMdClose className="text-white size-3" />
                                        </IconButton>
                                        <p className="text-center p-2 border-b border-slate-600">
                                          {s.start_hour < 10
                                            ? "0".concat(
                                              s.start_hour.toString()
                                            )
                                            : s.start_hour}
                                        </p>
                                        <p className="text-center p-2">
                                          {s.end_hour < 10
                                            ? "0".concat(s.end_hour.toString())
                                            : s.end_hour}
                                        </p>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                  <div className="flex justify-center">
                    <div className="px-10 py-4 w-full">
                      <h3
                        className={`text-primary text-xl text-center ${robotoBold.className}`}
                      >
                        Parámetros
                      </h3>
                      {incompleteDoctorData && (
                        <Alert
                          className="w-full shadow-md rounded-md my-2"
                          severity="warning"
                        >
                          Para realizar reuniones debes de completar los datos
                          obligatorios de tu configuración (*)
                        </Alert>
                      )}
                      <div className="flex flex-col md:flex-row gap-10 mt-4 md:mt-0 justify-between items-center">
                        <div className="w-full xl:w-1/2">
                          <h4 className="text-primary text-lg flex justify-center items-center gap-2">
                            <FaStopwatch /> Duración (*)
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
                        <div className="w-full xl:w-1/2">
                          <h4 className="text-primary text-xl flex justify-center items-center gap-2">
                            <FaMoneyBill1Wave /> Precio (*)
                          </h4>
                          <Input
                            className="w-full"
                            type="text"
                            name="priceMeeting"
                            onChange={updateForm.handleChange}
                            onBlur={updateForm.handleBlur}
                            value={updateForm.values.priceMeeting}
                          />
                        </div>
                      </div>
                      <div className="my-4">
                        <h3 className="text-primary text-xl text-center">
                          Descripción
                        </h3>
                        <textarea
                          onChange={($e) => setDescription($e.target.value)}
                          rows={8}
                          className="border border-primary rounded-sm w-full resize-none focus:outline-none p-2"
                          value={description}
                        ></textarea>
                      </div>
                      <div className="flex flex-col md:flex-row gap-10 mt-4 md:mt-0 justify-between items-center">
                        <div className="w-full xl:w-1/2">
                          <h4 className="text-primary text-xl flex justify-center items-center gap-2">
                            <FaBuildingColumns /> CBU/CVU (*)
                          </h4>
                          <div className="flex items-center">
                            <Input
                              className="w-full"
                              type="text"
                              name="cbu"
                              onChange={updateForm.handleChange}
                              onBlur={updateForm.handleBlur}
                              value={updateForm.values.cbu}
                            />
                          </div>
                        </div>
                        <div className="w-full xl:w-1/2">
                          <h4 className="text-primary text-xl flex justify-center items-center gap-2">
                            <FaMoneyBillTransfer /> Alias
                          </h4>
                          <div className="flex items-center">
                            <Input
                              className="w-full"
                              type="text"
                              name="alias"
                              onChange={updateForm.handleChange}
                              onBlur={updateForm.handleBlur}
                              value={updateForm.values.alias}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button type="submit">Guardar cambios</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Dialog
            open={
              confirmSchedule ||
              confirmUpdate ||
              confirmCancelPlan ||
              confirmHealthInsurance ||
              confirmDeleteHi ||
              Boolean(confirmDeleteSchedule)
            }
            onClose={() => {
              setConfirmSchedule(false);
              setConfirmUpdate(false);
              setConfirmCancelPlan(false);
              setConfirmHealthInsurance(false);
              setConfirmDeleteHi(false);
              setConfirmDeleteSchedule(null);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              className={`${robotoBold.className} text-primary text-lg`}
            >
              {confirmSchedule
                ? "Rango horario"
                : confirmUpdate
                  ? "Datos personales"
                  : confirmCancelPlan
                    ? "Cancelar plan"
                    : confirmHealthInsurance
                      ? "Confirmar obra social"
                      : confirmDeleteHi
                        ? "Eliminar obra social"
                        : Boolean(confirmDeleteSchedule)
                          ? "Eliminar rango horario"
                          : ""}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {confirmSchedule
                  ? "¿Desea agregar el rango horario?"
                  : confirmUpdate
                    ? "¿Desea actualizar los datos?"
                    : confirmCancelPlan
                      ? "¿Desea cancelar su plan actual?"
                      : confirmHealthInsurance
                        ? "¿Desea agregar la obra social?"
                        : confirmDeleteHi
                          ? "¿Estás seguro que deseas eliminar la obra social?"
                          : Boolean(confirmDeleteSchedule) ? <>¿Estás seguro que deseas eliminar el rango horario del día <span className="font-bold">{formatRange()}</span>?</>
                            : ""}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="text"
                onClick={() => {
                  setConfirmSchedule(false);
                  setConfirmUpdate(false);
                  setConfirmCancelPlan(false);
                  setConfirmHealthInsurance(false);
                  setConfirmDeleteHi(false);
                  setConfirmDeleteSchedule(null);
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

    let plans = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${auth?.token}` },
    });

    plans = plans.data;

    return {
      props: {
        doctor,
        schedules: schedules,
        healthInsurances,
        notification,
        auth,
        plans,
      },
    };
  },
  { protected: true, roles: ['doctor'] }
);
