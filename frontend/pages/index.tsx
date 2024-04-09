import React, { useEffect } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import Button from "@/components/button";
import {
  FaAngleRight,
  FaCalendarDays,
  FaChevronRight,
  FaCircleExclamation,
  FaGear,
  FaRightLong,
  FaUserDoctor,
} from "react-icons/fa6";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import { Chip, Divider, useTheme } from "@mui/material";
import Rate from "@/components/rate";
import { GoDotFill } from "react-icons/go";
import { IoMdMail } from "react-icons/io";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import Avatar from "@/components/avatar";
import Link from "next/link";
import { NotificationResponseDto } from "@/components/dto/notification.dto";
import { PiGearSix } from "react-icons/pi";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function Home(props: any) {
  const router = useRouter();
  const theme = useTheme();

  const [plans, setPlans] = React.useState<PlanResponseDto[]>([]);

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

  const pesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

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
                onClick={() =>
                  router.push(
                    `meetings/${btoa(
                      props.auth.role === "user"
                        ? props.auth.id
                        : props.lastMeeting?.user.id +
                            "." +
                            moment(props.lastMeeting?.startDatetime).format(
                              "YYYY-MM-DDTHH:mm:ss"
                            )
                    )}`
                  )
                }
                startIcon={<FaRightLong />}
              >
                Ver reunión
              </Button>
            </>
          ) : (
            <h2 className="mx-auto text-xl flex items-center gap-4 text-zinc-600">
              Actualmente no tiene reuniones pendientes{" "}
              <Button
                onClick={() => router.push("/doctors")}
                startIcon={<FaChevronRight />}
              >
                Solicite una
              </Button>
            </h2>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-5/6 mx-auto mt-4">
          <div className="bg-gray-100 w-full md:w-2/3 p-4 rounded-3xl shadow-lg">
            {props.auth.role === "user" || props.auth.role === "admin" ? (
              <>
                <h2 className="text-3xl text-center text-zinc-600">
                  Descubra nuestros profesionales recomendados
                </h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-white">
                  {props.doctors.map((doctor: DoctorResponseDto) => (
                    <div
                      key={doctor.id}
                      className="mt-[5rem] md:mt-[11rem] xl:mt-20 relative w-1/2"
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
                      <div className="flex flex-col items-center gap-3 mt-20">
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
                  ¿Desea actualizar su plan?
                </h2>
                <div className="flex justify-center items-center gap-8">
                  {plans.map((p: PlanResponseDto) => (
                    <div
                      key={p.id}
                      className="bg-white flex flex-col items-center shadow-xl"
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
                      <ul className="my-4">
                        {p.benefits.map((b: BenefitResponseDto) => (
                          <li key={b.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {b.name}
                          </li>
                        ))}
                      </ul>
                      <div className="my-4">
                        <Button onClick={() => router.push("/plan/" + p.id)}>
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
          <div className="flex flex-col items-center gap-4 bg-white w-full md:w-1/3 p-4 rounded-3xl shadow-lg min-h-[200px]">
            {props.auth.role === "user" &&
              (props.lastMeeting?.user?.healthInsurances.length === 0 ? (
                <>
                  <h2 className="text-3xl text-center text-zinc-600">
                    Es necesario que cargue sus obras sociales activas
                  </h2>
                  <FaCircleExclamation className="text-primary text-9xl" />
                  <Button onClick={() => router.push("/profile")}>
                    Cargar obras sociales
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
                      <div className="text-black">
                        <div key={n.id} className="p-2">
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
                                  ) : n.type === "verification hi" ? (
                                    `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de la obra social ${n.healthInsurance.name}`
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
              (!props.doctor.durationMeeting || !props.doctor.priceMeeting ? (
                <>
                  <h2 className="text-3xl text-center text-zinc-600">
                    Termine de configurar su perfil
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
                      <div className="text-black">
                        <div key={n.id} className="p-2">
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
                                  ) : n.type === "verification hi" ? (
                                    `El doctor ${n.userSend.surname}, ${n.userSend.name} solicitó verificación de la obra social ${n.healthInsurance.name}`
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

    let doctors = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor/premium`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    doctors = doctors.data;

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
        notifications: notifications.filter(
          (n: NotificationResponseDto) => n.readed === false
        ),
        plans,
      },
    };
  },
  { protected: true }
);
