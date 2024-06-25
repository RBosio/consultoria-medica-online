import React, { useEffect } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import Button from "@/components/button";
import {
  FaAddressCard,
  FaAngleRight,
  FaCalendarDays,
  FaChevronRight,
  FaCircleExclamation,
  FaRightLong,
  FaUserDoctor,
} from "react-icons/fa6";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import { useRouter } from "next/router";
import { Chip, Divider, Rating, useTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import Avatar from "@/components/avatar";
import Link from "@mui/material/Link";
import { NotificationResponseDto } from "@/components/dto/notification.dto";
import { PiGearSix } from "react-icons/pi";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";
import { MdDiscount, MdOutlineAdminPanelSettings } from "react-icons/md";
import { pesos } from "@/lib/formatCurrency";
import Alert from "@mui/material/Alert";
import Rate from "@/components/rate";

export default function Home(props: any) {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    moment.locale("es");
  }, []);

  const [plans, setPlans] = React.useState<PlanResponseDto[]>([]);

  const incompleteDoctorData =
    props.doctor &&
    (!props.doctor.cbu ||
      !props.doctor.priceMeeting ||
      !props.doctor.durationMeeting);

  const markAsRead = async (id: number) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${id}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );
  };

  useEffect(() => {
    if (props.doctor) {
      setPlans(
        props.plans.filter((plan: any) => plan.id > props.doctor.planId)
      );
    }
  }, []);

  return (
    <Layout auth={props.auth}>
      <section>
        <h1 className="text-3xl p-4 text-zinc-600">
          ¡Hola de nuevo{" "}
          <span className="text-primary font-semibold">
            {props.auth.surname}, {props.auth.name}!
          </span>
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center bg-white w-5/6 mx-auto p-4 rounded-3xl shadow-lg gap-4 md:gap-0">
          {props.lastMeeting?.startDatetime ? (
            <>
              <div>
                <h2 className="text-xl text-primary font-semibold underline">
                  Próxima reunión programada
                </h2>
              </div>
              <div>
                <h2 className="text-xl text-center text-zinc-600">
                  {props.auth.role === "user"
                    ? props.lastMeeting?.doctor.user.surname +
                      ", " +
                      props.lastMeeting?.doctor.user.name
                    : props.lastMeeting?.user.surname +
                      ", " +
                      props.lastMeeting?.user.name}
                </h2>
                <div className="text-white bg-primary flex justify-center items-center p-2 rounded-lg">
                  <FaCalendarDays />
                  <p className="ml-1 text-sm sm:text-base">
                    {moment(props.lastMeeting?.startDatetime).format("LLLL")}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  const route = `meetings/${btoa(
                    props.auth.role === "user"
                      ? props.auth.id +
                          "." +
                          moment(props.lastMeeting?.startDatetime).format(
                            "YYYY-MM-DDTHH:mm:ss"
                          )
                      : props.lastMeeting?.user.id +
                          "." +
                          moment(props.lastMeeting?.startDatetime).format(
                            "YYYY-MM-DDTHH:mm:ss"
                          )
                  )}`;
                  router.push(route);
                }}
                startIcon={<FaRightLong />}
              >
                Ver reunión
              </Button>
            </>
          ) : props.auth.role === "doctor" &&
            props.doctor &&
            !props.doctor.plan ? (
            <Alert className="w-full rounded-lg" severity="warning">
              Para realizar reuniones debes solicitar un plan de trabajo
            </Alert>
          ) : incompleteDoctorData ? (
            <Alert className="w-full rounded-lg" severity="warning">
              Para realizar reuniones debes de completar los datos obligatorios
              de tu <Link href="/config">configuración</Link>
            </Alert>
          ) : props.doctor && props.doctor.schedules.length === 0 ? (
            <Alert className="w-full rounded-lg" severity="warning">
              Para realizar reuniones debes registrar al menos un rango horario
              en <Link href="/config">configuración</Link>
            </Alert>
          ) : (
            <h2 className="mx-auto text-xl flex flex-col md:flex-row items-center gap-4 text-zinc-600">
              Actualmente no tiene reuniones pendientes{" "}
              {(props.auth.role === "user" || props.auth.role === "admin") && (
                <Button
                  onClick={() => router.push("/doctors")}
                  startIcon={<FaChevronRight />}
                >
                  Solicite una
                </Button>
              )}
            </h2>
          )}
        </div>
        <div className="flex flex-col 2xl:flex-row justify-between items-center gap-4 w-full xl:w-5/6 mx-auto mt-4 mb-4">
          <div className="bg-gray-100 w-5/6 xl:w-full p-4 rounded-3xl shadow-lg">
            {props.auth.role === "user" || props.auth.role === "admin" ? (
              <>
                <h2 className="text-3xl text-center text-zinc-600">
                  Descubra nuestros profesionales recomendados
                </h2>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 bg-white rounded-3xl">
                  {props.doctors.map((doctor: DoctorResponseDto) => (
                    <div
                      key={doctor.id}
                      className="mt-[5rem] md:mt-0 xl:mt-20 relative w-1/2"
                    >
                      <Avatar
                        labelProps={{ className: "hidden xl:hidden" }}
                        name={doctor.user.name}
                        surname={doctor.user.surname}
                        rootClassName="absolute top-[-4rem] md:top-[2rem] xl:top-[-4rem] left-1/2 translate-x-[-50%]"
                        className="bg-primary"
                        size={130}
                        icon={<FaUserDoctor size={60} />}
                        photo={
                          doctor.user.image ? doctor.user.image : undefined
                        }
                      />
                      <div className="flex flex-col items-center gap-3 mt-20 md:mt-44 xl:mt-20">
                        <h2 className={`text-primary text-center text-3xl`}>
                          {doctor.user.name} {doctor.user.surname}
                        </h2>
                        <div className="flex gap-2">
                          {doctor.specialities.map((spec: any) => (
                            <Chip
                              key={spec.id}
                              size="small"
                              variant="outlined"
                              color="primary"
                              label={spec.name}
                            />
                          ))}
                        </div>
                        <Rate rate={Number(doctor.avgRate)} />
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
                            <Button
                              onClick={() =>
                                router.push(`doctors/${doctor.id}`)
                              }
                            >
                              Consultar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl text-center text-zinc-600 mb-4">
                  {props.doctor.plan
                    ? "¿Desea actualizar su plan?"
                    : "Solicite un plan de trabajo para comenzar"}
                </h2>
                <div className="flex flex-col w-full 2xl:flex-row justify-center items-center gap-8">
                  {plans.map((p: PlanResponseDto) => (
                    <div
                      key={p.id}
                      className="bg-white flex flex-col items-center shadow-xl rounded-md"
                    >
                      <h2 className="text-3xl text-primary font-semibold text-center pt-4">
                        {p.name}
                      </h2>
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
                      <ul className="my-4 p-4 min-h-28">
                        {p.benefits.map((b: BenefitResponseDto) => (
                          <li key={b.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {b.name}
                          </li>
                        ))}
                      </ul>
                      <div className="my-4">
                        <Button
                          onClick={() => router.push("/config/plan/" + p.id)}
                        >
                          Actualizar plan
                        </Button>
                      </div>
                      <h4 className="px-12 py-4 text-white text-center font-extrabold text-xl bg-primary w-full">
                        {pesos.format(p.price)} / mes
                      </h4>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-4 bg-white w-5/6 xl:w-full p-4 rounded-3xl shadow-lg">
            {props.auth.role === "user" &&
              (props.lastMeeting?.user?.healthInsurances.length === 0 ? (
                <>
                  <h2 className="text-2xl text-center text-zinc-600">
                    Si tienes una obra social, podrás acceder a los descuentos
                    disponibles para los profesionales
                  </h2>
                  <MdDiscount className="text-primary text-9xl" />
                  <Button onClick={() => router.push("/profile")}>
                    Ir a perfil de usuario
                  </Button>
                </>
              ) : (
                <div
                  className={`flex flex-col items-center ${
                    props.notifications.length > 0 && "overflow-y-scroll"
                  }`}
                >
                  <h2 className="text-3xl text-center text-zinc-600">
                    Ultimas notificaciones no leídas
                  </h2>
                  {props.notifications.length === 0 && (
                    <h2 className="text-primary text-center font-semibold mt-8">
                      Actualmente no tiene notificaciones pendientes
                    </h2>
                  )}
                  {props.notifications.map((n: any) => {
                    return (
                      <div key={n.id} className="text-black">
                        <div className="p-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="p-2 text-lg">
                                  {n.type === "verification" ? (
                                    `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de su cuenta`
                                  ) : n.type === "comment" ? (
                                    <>
                                      El{" "}
                                      {props.auth.role === "user"
                                        ? "doctor"
                                        : "usuario"}{" "}
                                      {n.userSend.surname}, {n.userSend.name}{" "}
                                      realizó un comentario en la reunión del
                                      día{" "}
                                      <span>
                                        {moment(n.meeting.startDatetime).format(
                                          "LLL"
                                        )}
                                      </span>
                                    </>
                                  ) : n.type === "verificationHiRequest" ? (
                                    `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de la obra social ${n.healthInsurance.name}`
                                  ) : n.type === "verificationHi" ? (
                                    `El administrador ${n.userSend.surname}, ${n.userSend.name} acaba de realizar la verificación de la obra social ${n.healthInsurance.name}`
                                  ) : (
                                    ""
                                  )}
                                </p>
                              </div>
                              <p className="text-sm text-right p-2 text-gray-400">
                                {moment(n.created_at).format("LLL")}
                              </p>
                            </div>
                            <div className="flex justify-end gap-2 text-xl text-primary">
                              <Link
                                href={
                                  n.type === "comment"
                                    ? `/meetings/${btoa(
                                        n.meeting.userId +
                                          "." +
                                          moment(
                                            n.meeting.startDatetime
                                          ).format("YYYY-MM-DDTHH:mm:ss")
                                      )}`
                                    : n.type === "verificationHi"
                                    ? "/profile"
                                    : ""
                                }
                                onClick={() => {
                                  markAsRead(n.id);
                                }}
                              >
                                <FaAngleRight className="hover:opacity-70" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="w-[90%] border-b-2 border-primary h-2 m-auto"></div>
                      </div>
                    );
                  })}
                </div>
              ))}
            {props.auth.role === "doctor" &&
              (!props.doctor.durationMeeting ||
              !props.doctor.priceMeeting ||
              !props.doctor.cbu ? (
                <>
                  <h2 className="text-3xl text-center text-zinc-600">
                    Complete los datos de su configuración para comenzar
                  </h2>
                  <PiGearSix className="text-primary text-9xl" />
                  <Button onClick={() => router.push("/config")}>
                    Ir a configuración
                  </Button>
                </>
              ) : (
                <div
                  className={`flex flex-col items-center ${
                    props.notifications.length > 0 && "overflow-y-scroll"
                  }`}
                >
                  <h2 className="text-3xl text-center text-zinc-600">
                    Ultimas notificaciones no leidas
                  </h2>
                  {props.notifications.length === 0 && (
                    <h2 className="text-primary font-semibold mt-8">
                      Actualmente no tiene notificaciones pendientes
                    </h2>
                  )}
                  {props.notifications.map((n: any) => {
                    return (
                      <div key={n.id} className="text-black">
                        <div className="p-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="p-2 text-lg">
                                  {n.type === "verification" ? (
                                    `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de su cuenta`
                                  ) : n.type === "comment" ? (
                                    <>
                                      El{" "}
                                      {props.auth.role === "user"
                                        ? "doctor"
                                        : "usuario"}{" "}
                                      {n.userSend.surname}, {n.userSend.name}{" "}
                                      realizó un comentario en la reunión del
                                      día{" "}
                                      <span>
                                        {moment(n.meeting.startDatetime).format(
                                          "LLL"
                                        )}
                                      </span>
                                    </>
                                  ) : n.type === "verificationHiRequest" ? (
                                    `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de la obra social ${n.healthInsurance.name}`
                                  ) : n.type === "verificationHi" ? (
                                    `El administrador ${n.userSend.surname}, ${n.userSend.name} acaba de realizar la verificación de la obra social ${n.healthInsurance.name}`
                                  ) : n.type === "meeting" && n.meeting ? (
                                    `El usuario ${n.userSend.surname}, ${
                                      n.userSend.name
                                    } acaba de solicitar una reunión para el día ${moment(
                                      n.meeting.startDatetime
                                    ).format("LLL")}`
                                  ) : n.type === "verificationDoc" ? (
                                    `El administrador ${n.userSend.surname}, ${n.userSend.name} acaba de realizar la verificación su cuenta`
                                  ) : n.type === "rdatetime" ? (
                                    `El paciente ${n.userSend.surname}, ${
                                      n.userSend.name
                                    } acaba de realizar la modificación de la reunión del día ${moment(
                                      n.mStartDOld
                                    ).format("LLLL")} hs para el día ${moment(
                                      n.mStartDNew
                                    ).format("LLLL")} hs`
                                  ) : (
                                    ""
                                  )}
                                </p>
                              </div>
                              <p className="text-sm text-right p-2 text-gray-400">
                                {moment(n.created_at).format("LLL")}
                              </p>
                            </div>
                            <div className="flex justify-end gap-2 text-xl text-primary">
                              <Link
                                href={
                                  n.type === "comment"
                                    ? `/meetings/${btoa(
                                        n.meeting.userId +
                                          "." +
                                          moment(
                                            n.meeting.startDatetime
                                          ).format("YYYY-MM-DDTHH:mm:ss")
                                      )}`
                                    : n.type === "verificationHi"
                                    ? "/profile"
                                    : n.type === "meeting" && n.meeting
                                    ? `/meetings/${btoa(
                                        n.meeting.userId +
                                          "." +
                                          moment(
                                            n.meeting.startDatetime
                                          ).format("YYYY-MM-DDTHH:mm:ss")
                                      )}`
                                    : n.type === "verificationDoc"
                                    ? "/profile"
                                    : n.type === "rdatetime"
                                    ? `/meetings/${btoa(
                                        n.userIdSend +
                                          "." +
                                          moment(n.mStartDNew).format(
                                            "YYYY-MM-DDTHH:mm:ss"
                                          )
                                      )}`
                                    : ""
                                }
                                onClick={() => {
                                  markAsRead(n.id);
                                }}
                              >
                                <FaAngleRight className="hover:opacity-70" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="w-[90%] border-b-2 border-primary h-2 m-auto"></div>
                      </div>
                    );
                  })}
                </div>
              ))}
            {props.auth.role === "admin" && (
              <>
                <h2 className="text-3xl text-center text-zinc-600">
                  Panel administración
                </h2>
                <MdOutlineAdminPanelSettings className="text-primary text-9xl" />
                <Button onClick={() => router.push("/admin")}>
                  Ir al panel
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let lastMeeting;
    let id = auth?.id;

    let doctor;

    if (auth?.role === "doctor") {
      doctor = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctor/user/${auth?.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );
      doctor = doctor.data;
      id = doctor.id;
    }

    lastMeeting = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/lastMeeting/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    lastMeeting = lastMeeting.data;

    let doctors;

    try {
      doctors = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/doctor/advanced`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      doctors = doctors.data;
    } catch (error) {
      doctors = [];
    }

    const not = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/${auth?.id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${auth?.token}` },
      }
    );

    const notifications = not.data;

    let plans = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${auth?.token}` },
    });

    plans = plans.data;

    if (!doctor) {
      doctor = null;
    }

    return {
      props: {
        auth,
        lastMeeting,
        doctors,
        doctor,
        notifications: notifications.filter((n: NotificationResponseDto) => {
          if (n.type === "meeting" && !n.meeting) return false;

          return n.readed === false;
        }),
        plans,
      },
    };
  },
  { protected: true, roles: ['user', 'doctor', 'admin'] }
);
