import withAuth from "@/lib/withAuth";
import { Auth } from "@/types";
import Layout from "@/components/layout";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { roboto, robotoBold } from "@/lib/fonts";
import axios from "axios";
import Button from "@/components/button";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import { FaAddressCard, FaCalendarDays, FaMars, FaUser, FaUserDoctor, FaVenus } from "react-icons/fa6";
import { showDni } from "@/lib/dni";
import moment from "moment";
import HealthInsurance from "@/components/healthInsurance";
import Link from "next/link";
import { IoIosCloseCircleOutline, IoIosTimer } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import Rate from "@/components/rate";

export default function Meeting(props: any) {
  const theme = useTheme();
  const router = useRouter();

  const [meeting, setMeeting] = useState<any>();
  const [time, setTime] = useState("00:00");
  const [count, setCount] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [openedMeetingData, setOpenedMeetingData] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  let uitoolkit: any;

  const initTime = new Date();
  let sessionContainer: HTMLElement;
  let config = {
    videoSDKJWT: "",
    sessionName: "test",
    userName: props.auth.name,
    sessionPasscode: "123",
    features: ["video", "audio", "settings", "chat"],
  };
  let role = 1;

  const extract = () => {
    const { id } = router.query;
    let t: string = "";
    let startDatetime: string = "";

    if (id && typeof id === "string") {
      [t, startDatetime] = atob(id).split(".");
    }

    return [t, startDatetime];
  };

  useEffect(() => {
    (async () => {
      const resp = await join();
      config.sessionName = resp.tpc;

      uitoolkit = await (await import("@zoom/videosdk-ui-toolkit")).default;

      getVideoSDKJWT();
    })();
  }, []);

  async function join() {
    const [t, startDatetime] = extract();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/join/${t}/${startDatetime}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMeeting({ ...res.data.meeting });

    const resp = {
      user: res.data.meeting.user,
      doctor: res.data.meeting.doctor,
      tpc: res.data.meeting.tpc,
      token: res.data.tokenMeeting,
    };

    return resp;
  }

  async function getVideoSDKJWT() {
    sessionContainer = document.getElementById("sessionContainer")!;
    const [t, startDatetime] = extract();

    let authEndpoint =
      process.env.NEXT_PUBLIC_API_URL + `/meeting/join/${t}/${startDatetime}`;

    axios
      .post(authEndpoint, {
        role: role,
      })
      .then(({ data }) => {
        if (data.tokenMeeting) {
          config.videoSDKJWT = data.tokenMeeting;
          joinSession();
          setStartTimer(true);
        };
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function joinSession() {
    uitoolkit.joinSession(sessionContainer, config);
    uitoolkit.onSessionClosed(sessionClosed);
  }

  var sessionClosed = () => {
    uitoolkit.closeSession(sessionContainer);
    leaveSession();
  };

  const leaveSession = async () => {
    setCancelDialog(false);

    const [t, startDatetime] = extract();

    localStorage.setItem("startDatetime", startDatetime);

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/finish/${t}/${startDatetime}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    const { id } = router.query;

    router.push(`/meetings/${id}`);
  };

  useEffect(() => {
    if (!startTimer) {
      return;
    }
    var id = setInterval(() => {
      var left = count + (new Date().getTime() - initTime.getTime());
      setCount(left);
      showTimer(left);
      if (left <= 0) {
        setTime("00:00");
        clearInterval(id);
      }
    }, 1);
    return () => clearInterval(id);
  }, [startTimer]);

  const showTimer = (ms: number) => {
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    setTime(minute + ":" + second);
  };

  return (
    <Layout renderSidebar={false} renderNavbar={false} auth={props.auth}>
      <>
        {meeting &&
          <div className="h-full flex grow overflow-y-hidden">
            <VideocallSidebar auth={props.auth} time={time} openedMeetingData={openedMeetingData} setOpenedMeetingData={setOpenedMeetingData} user={meeting.user} doctor={meeting.doctor} />
            <div className="overflow-y-auto p-4 flex w-full">
              <div className="w-full xl:w-9/12 m-auto" id="sessionContainer">
              </div>
            </div>
          </div>
        }
        <Dialog
          open={cancelDialog}
          onClose={() => setCancelDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            className={`${robotoBold.className} text-red-600`}
            id="alert-dialog-title"
          >
            Salir de Videollamada
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro que deseas salir de la videollamada? No podrás
              volver a conectarte luego de abandonar la misma.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="text"
              onClick={() => setCancelDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={leaveSession} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
        <Fab
          color="primary"
          onClick={() => setOpenedMeetingData(true)}
          aria-label="chat"
          className="z-0 bg-secondary hover:bg-[#4F4F4F] fixed bottom-4 right-8 text-white md:hidden"
        >
          <IoMenu size={25} />
        </Fab>
      </>
    </Layout>
  );
}

const VideocallSidebar: React.FC<any> = (props) => {
  return (<>
    {props.openedMeetingData && <div onClick={() => props.setOpenedMeetingData(false)} className="md:hidden bg-black opacity-75 absolute top-0 left-0 right-0 bottom-0 z-[999]"></div>}
    <div className={`flex flex-col shadow-md
        max-w-[300px]
        absolute transition-[left] 
        duration-300 ease-in
        top-0 ${props.openedMeetingData ? "left-0" : "left-[-48rem]"} 
        shrink-0 bg-white h-full
        z-[1000] md:static
        `}>
      {
        // Si el usuario actual es médico, renderiza los datos del usuario de la meeting (su contraparte)
        // Por lo contrario, si el usuario actual es el user, los datos del médico de la meeting son los que se renderizan
        props.auth?.role ? props.auth?.role === 'doctor' ? <UserCard user={props.user} /> : <DoctorCard doctor={props.doctor} /> : null
      }
      <div className="p-10 flex justify-center items-center border-t-[1px] border-primary">
        <div className={`text-white flex-col flex items-center gap-1`}>
          <p className={`text-primary ${roboto.className}`}>Tiempo de reunión</p>
          <Chip color={'primary'}
            className={`text-white text-lg p-4 ${robotoBold.className}`}
            icon={<IoIosTimer size={25} />}
            label={props.time}
          />
        </div>
      </div>
    </div>
  </>
  )
}

const UserCard: React.FC<any> = (props) => {
  return (
    <>
      <div className="relative">
        <div className="w-full flex justify-end md:hidden">
          <IconButton
            onClick={() => props.setOpenedMeetingData(false)}
            className="ml-auto"
            color="primary"
          >
            <IoIosCloseCircleOutline
              size="25"
            />
          </IconButton>
        </div>
        {props.user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/images/${props.user.image}`}
            alt="Profile photo"
            className="h-64 sm:h-56 object-cover w-full"
          />
        ) : (
          <>
            <div className="w-full bg-primary flex items-center justify-center p-6">
              <FaUser color="#ffffff" size={80} />
            </div>
            <div className="bg-primary w-full h-2 absolute bottom-0"></div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col justify-start items-center flex-1 mt-2 overflow-y-auto">
        <h2
          className={`${robotoBold.className} text-2xl text-primary text-center my-2`}
        >
          {props.user.name} {props.user.surname}
        </h2>
        <div className="w-3/4 h-2 border-t-2 border-emerald-200"></div>
        <div className="flex flex-col items-center my-2">
          <div className="flex items-center">
            <FaAddressCard className="text-primary" />
            <p className="px-2">{showDni(props.user.dni)}</p>
          </div>
          <div className="flex items-center">
            <FaCalendarDays className="text-primary" />
            <p className="px-2">
              {moment().diff(props.user.birthday, "years")} años
            </p>
          </div>
          <div className="flex items-center">
            {props.user.gender ? (
              <FaMars className="text-primary" />
            ) : (
              <FaVenus className="text-primary" />
            )}

            <p className="px-2">
              {props.user.gender ? "Femenino" : "Masculino"}
            </p>
          </div>
          <HealthInsurance
            healthInsurances={props.user.healthInsurances}
          ></HealthInsurance>
        </div>
        <div className="w-3/4 h-2 border-b-2 border-emerald-200"></div>
        <Link href={`/meetings/medical-record/${props.user.id}`} target="_blank">
          <Button className="m-4">Historia clínica</Button>
        </Link>
      </div>
    </>
  )
};

const DoctorCard: React.FC<any> = (props) => {
  return (
    <>
      <div className="relative">
        {props.doctor.user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/images/${props.doctor.user.image}`}
            alt="Profile photo"
            className="h-64 sm:h-56 object-cover w-full"
          />
        ) : (
          <>
            <div className="w-full bg-primary flex items-center justify-center p-6">
              <FaUserDoctor color="#ffffff" size={80} />
            </div>
            <div className="bg-primary w-full h-2 absolute bottom-0"></div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col justify-start items-center flex-1 mt-2 overflow-y-auto">
        <h2
          className={`${robotoBold.className} text-lg sm:text-2xl text-primary text-center mt-2`}
        >
          {props.doctor.user.name} {props.doctor.user.surname}
        </h2>
        <div className="flex mb-2">
          {props.doctor.specialities.map((s: any) => {
            return (
              <Chip
                className="my-1 sm:mt-2"
                key={s.id}
                size="small"
                variant="outlined"
                color="primary"
                label={s.name}
              />
            );
          })}
        </div>
        <div className="w-3/4 h-2 border-t-2 border-emerald-200"></div>
        <Rate rate={props.doctor.avgRate} />
        {props.doctor.description ? (
          <p className="text-base p-4 text-justify line-clamp-10">
            {props.doctor.description}
          </p>
        ) : (
          <div className="p-4 text-center">
            El profesional no posee descripción actualmente
          </div>
        )}
      </div>
    </>
  )
};

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    return {
      props: {
        auth,
      },
    };
  },
  { protected: true, roles: ["user", "doctor", "admin"] }
);
