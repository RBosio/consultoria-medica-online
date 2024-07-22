import withAuth from "@/lib/withAuth";
import { Auth } from "@/types";
import Layout from "@/components/layout";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaUserDoctor,
  FaVideo,
  FaVideoSlash,
  FaXmark,
} from "react-icons/fa6";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import { UserResponseDto } from "@/components/dto/user.dto";
import { VideoClient } from "@zoom/videosdk";
import Input from "@/components/input";
import { robotoBold } from "@/lib/fonts";
import axios from "axios";
import Avatar from "@/components/avatar";
import { IoIosTimer, IoMdArrowRoundBack } from "react-icons/io";
import Button from "@/components/button";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

export default function Meeting(props: any) {
  const theme = useTheme();
  const router = useRouter();

  let client: typeof VideoClient;

  const [doctor, setDoctor] = useState<DoctorResponseDto>();
  const [user, setUser] = useState<UserResponseDto>();
  const [audio, setAudio] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [time, setTime] = useState("00:00");
  const [count, setCount] = useState(0);
  const [countUsers, setCountUsers] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [openedChat, setOpenedChat] = useState(false);
  const [rate, setRate] = useState<boolean>(false);
  const [meetingId, setMeetingId] = useState("");
  const [startDatetimeS, setMeetingStartDatetime] = useState("");

  let uitoolkit: any;

  const handleOnClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === "container") {
      setOpenedChat(false);
    }
  };

  async function finish() {
    const { id } = router.query;

    if (id && typeof id === "string") {
      const [t, startDatetime] = atob(id).split(".");

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/finish/${t}/${startDatetime}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
    }
  }

  const extract = () => {
    const { id } = router.query;
    let t: string = "";
    let startDatetime: string = "";

    if (id && typeof id === "string") {
      [t, startDatetime] = atob(id).split(".");
    }

    return [t, startDatetime];
  };

  async function join() {
    const [t, startDatetime] = extract();
    console.log(t, startDatetime);
    setMeetingId(t);
    setMeetingStartDatetime(startDatetime);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/join/${t}/${startDatetime}`,
      {},
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    const resp = {
      user: res.data.meeting.user,
      doctor: res.data.meeting.doctor,
      tpc: res.data.meeting.tpc,
      token: res.data.tokenMeeting,
    };
    return resp;
  }

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

  useEffect(() => {
    (async () => {
      const resp = await join();
      config.sessionName = "test" // resp.tpc;

      uitoolkit = await (await import("@zoom/videosdk-ui-toolkit")).default;

      getVideoSDKJWT();
    })();
    // meeting()
    //   .then((res) => {})
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, []);

  const leaveSession = async () => {
    setRate(true);
    setCancelDialog(false);

    const { id } = router.query;

    if (id && typeof id === "string") {
      const [t, startDatetime] = atob(id).split(".");
      localStorage.setItem("startDatetime", startDatetime);
    }

    await finish();
    router.push("/");
  };

  const initTime = new Date();

  const showTimer = (ms: number) => {
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    setTime(minute + ":" + second);
  };

  let sessionContainer: HTMLElement;
  let config = {
    videoSDKJWT: "",
    sessionName: "test",
    userName: props.auth.name,
    sessionPasscode: "123",
    features: ["video", "audio", "settings", "chat"],
  };
  let role = 1;

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
          console.log(data.tokenMeeting);
          config.videoSDKJWT = data.tokenMeeting;
          joinSession();
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function joinSession() {
    console.log(config);
    console.log(sessionContainer);
    uitoolkit.joinSession(sessionContainer, config);

    uitoolkit.onSessionClosed(sessionClosed);
  }

  var sessionClosed = () => {
    uitoolkit.closeSession(sessionContainer);
    leaveSession();
  };

  return (
    <Layout renderSidebar={false} renderNavbar={false} auth={props.auth}>
      <div className="w-1/2 mx-auto">
        <div className="w-full my-4">
          {props.auth.role === "doctor" && (
            <a
              href={`../../meetings/medical-record/${user?.id}`}
              target="_blank"
            >
              <Button>Ver historia clínica</Button>
            </a>
          )}
        </div>
        {/* <div className="flex flex-col relative justify-center items-center xl:p-5">
          <div className="flex flex-col relative">
            {loading ? (
              <div className="absolute top-0 right-0 w-full h-full bg-black z-10 opacity-75 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <CircularProgress />
                  <span className="font-bold text-white">
                    Su videollamada se está cargando...
                  </span>
                </div>
              </div>
            ) : null}
            <div className="flex justify-between items-center bg-primary p-4 rounded-t-md">
              <Avatar
                labelProps={{
                  className: "text-white font-bold text-lg ml-2",
                }}
                name={doctor?.user.name ?? ""}
                surname={doctor?.user.surname ?? ""}
                className="bg-white"
                size={70}
                icon={
                  <FaUserDoctor color={theme.palette.primary.main} size={30} />
                }
                photo={doctor?.user.image ? doctor.user.image : undefined}
              />
              <div className="text-white flex items-center gap-1">
                <IoIosTimer size={25} />
                <p className="text-xl">{time}</p>
              </div>
            </div>
            <div
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              className="relative w-[500px] h-[281px] md:w-[650px] md:h-[365px] lg:w-[700px] lg:h-[394px] xl:w-[1100px] xl:h-[619px] overflow-hidden"
            >
              <div className="right-3 top-3 absolute w-[150px] h-[84px] lg:w-[200px] lg:h-[113px]">
                <div className="relative">
                  <video
                    id="my-video"
                    className="bg-gray-800"
                    style={{ width: "100%", height: "auto" }}
                  ></video>
                  <p className="absolute bottom-0 right-0 text-white mr-2">
                    {`${props.auth.name} ${props.auth.surname} (You)`}
                  </p>
                </div>
              </div>
              <video
                id="other-canvas"
                className="bg-gray-600 rounded-b-md"
                style={{ width: "100%", height: "100%" }}
              ></video>
              <p className="absolute bottom-0 right-0 text-white mr-2">
                {props.auth.role !== "user"
                  ? `${user ? user.name : ""} ${user ? user.surname : ""}`
                  : `${doctor ? doctor.user.name : ""} ${
                      doctor ? doctor.user.surname : ""
                    }`}
              </p>
          </div>
        </div>
        </div> */}
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

        <div id="sessionContainer"></div>
      </div>
    </Layout>
  );
}

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
