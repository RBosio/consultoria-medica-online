import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import Layout from "@/components/layout";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, useTheme } from "@mui/material";
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
  const [time, setTime] = useState('00:00');
  const [count, setCount] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [openedChat, setOpenedChat] = useState(false);

  const handleOnClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === "container") {
      setOpenedChat(false);
    }
  };

  async function join() {
    const { id } = router.query;

    if (id && typeof id === "string") {
      const [t, startDatetime] = atob(id).split(".");

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
        token: res.data.tokenMeeting
      }
      return resp
    }
  }

  const joinMeeting = async (
    topic: string,
    token: string,
    myVideo: HTMLVideoElement,
    otherCanvas: HTMLCanvasElement
  ) => {
    await client.join(
      topic,
      token,
      `${props.auth.name} ${props.auth.surname}`,
      ""
    );

    const stream = client.getMediaStream();

    if (myVideo && otherCanvas) {
      await stream.startVideo({
        videoElement: myVideo,
      });

      await stream.renderVideo(
        myVideo,
        client.getCurrentUserInfo().userId,
        320,
        180,
        0,
        0,
        2
      );

      client.getAllUser().forEach((user) => {
        if (user.bVideoOn) {
          stream.renderVideo(otherCanvas, user.userId, 768, 432, 0, 0, 1);
        }
      });

      await stream.startAudio();
      await stream.unmuteAudio();
    }
  };

  const BindEvents = async () => {
    const client = await getClient();
    const stream = client.getMediaStream();
    const chat = client.getChatClient();

    const otherCanvas = document.getElementById(
      "other-canvas"
    ) as HTMLCanvasElement;

    client.on("user-added", async (payload) => {
      if (payload[0].bVideoOn && self) {
        await stream.renderVideo(
          otherCanvas,
          payload[0].userId,
          768,
          432,
          0,
          0,
          2
        );
      }
    });
  };

  const meeting = async () => {
    setLoading(true);
    const ZoomVideo = await (await import("@zoom/videosdk")).default;
    const resp = await join()

    setUser(resp?.user)
    setDoctor(resp?.doctor)

    console.log(resp)
    const myVideo = document.getElementById("my-video") as HTMLVideoElement;
    const otherCanvas = document.getElementById(
      "other-canvas"
    ) as HTMLCanvasElement;

    const client = await getClient();

    if (
      ZoomVideo.checkSystemRequirements().video &&
      ZoomVideo.checkSystemRequirements().audio
    ) {
      await client.init("en-US", "Global", { patchJsMedia: true });
      await BindEvents();

      await joinMeeting(resp?.tpc, resp?.token, myVideo, otherCanvas);

    }

    setLoading(false);
    setStartTimer(true);
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

  useEffect(() => {
    meeting()
      .then((res) => { })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const toggleAudio = async () => {
    const client = await getClient();
    const stream = client.getMediaStream();

    if (audio) {
      await stream.muteAudio();
      setAudio(false);
    } else {
      await stream.unmuteAudio();
      setAudio(true);
    }
  };

  const toggleVideo = async () => {
    const client = await getClient();
    const stream = client.getMediaStream();

    if (video) {
      await stream.stopVideo();
      setVideo(false);
    } else {
      const myVideo = document.getElementById("my-video") as HTMLVideoElement;
      await stream.startVideo({
        videoElement: myVideo,
      });
      await stream.renderVideo(
        myVideo,
        client.getCurrentUserInfo().userId,
        320,
        180,
        0,
        0,
        2
      );
      setVideo(true);
    }
  };

  const leaveSession = async () => {
    const client = await getClient();

    client.leave();
    router.push("/");
  };

  const getClient = async () => {
    const ZoomVideo = await (await import("@zoom/videosdk")).default;
    client = ZoomVideo.createClient();
    return client;
  };

  const handleSubmit = async ($e: any) => {
    $e.preventDefault();

    const client = await getClient();
    const chat = await client.getChatClient();

    await chat.sendToAll(text);
    const h = chat.getHistory().map((h) => {
      return {
        id: h.id,
        message: h.message,
        name: h.sender.name,
      };
    });

    setHistory(h);
    setText("");
  };

  const initTime = new Date();

  const showTimer = (ms: number) => {
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    setTime(
      minute + ":" + second
    );
  };

  return (
    <Layout navbarLeftElement={
      <Button onClick={() => router.push("/")} startIcon={<IoMdArrowRoundBack />}>Atrás</Button>
    } renderSidebar={false} auth={props.auth}>
      <div className="flex h-full ">
        <div className="w-full flex flex-col relative justify-center items-center xl:p-5">
          <div className="flex flex-col relative">
            {loading ? <div className="absolute top-0 right-0 w-full h-full bg-black z-10 opacity-75 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <CircularProgress />
                <span className="font-bold text-white">Su videollamada se está cargando...</span>
              </div>
            </div> : null}
            <div className="flex justify-between items-center bg-primary p-4 rounded-t-md">
              <Avatar
                labelProps={{ className: "text-white font-bold text-lg ml-2" }}
                name={doctor?.user.name ?? ""}
                surname={doctor?.user.surname ?? ""}
                className="bg-white"
                size={70}
                icon={<FaUserDoctor color={theme.palette.primary.main} size={30} />}
                photo={doctor?.user.image ? doctor.user.image : undefined} />
              <div className="text-white flex items-center gap-1">
                <IoIosTimer size={25} />
                <p className="text-xl">
                  {time}
                </p>
              </div>
            </div>
            <div
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              className="relative w-[500px] h-[281px] md:w-[650px] md:h-[365px] lg:w-[700px] lg:h-[394px] xl:w-[1100px] xl:h-[619px] overflow-hidden">
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
                  : `${doctor ? doctor.user.name : ""} ${doctor ? doctor.user.surname : ""
                  }`}
              </p>
              <div className={`absolute ${showControls ? "bottom-0" : "bottom-[-30%]"} transition-[bottom] ease duration-200 p-4 w-full flex gap-10 justify-center`}>
                <div
                  className="w-10 h-10 bg-primary text-white rounded-full flex justify-center items-center hover:opacity-70 hover:cursor-pointer"
                  onClick={toggleAudio}
                >
                  {audio ? (
                    <FaMicrophone className="text-xl" />
                  ) : (
                    <FaMicrophoneSlash className="text-xl" />
                  )}
                </div>
                <div
                  className="w-10 h-10 bg-primary text-white rounded-full flex justify-center items-center hover:opacity-70 hover:cursor-pointer"
                  onClick={toggleVideo}
                >
                  {video ? (
                    <FaVideo className="text-xl" />
                  ) : (
                    <FaVideoSlash className="text-xl" />
                  )}
                </div>
                <div
                  className="w-10 h-10 bg-red-600 text-white rounded-full flex justify-center items-center hover:opacity-70 hover:cursor-pointer"
                  onClick={() => setCancelDialog(true)}
                >
                  <FaXmark className="text-xl" />
                </div>
              </div>
            </div>

          </div>
        </div>
        <Fab
            color="primary"
            onClick={() =>
              openedChat ? setOpenedChat(false) : setOpenedChat(true)
            }
            aria-label="chat"
            className="z-0 bg-secondary hover:bg-[#4F4F4F] absolute bottom-4 right-8 text-white sm:hidden"
          >
            <BsFillChatLeftTextFill />
          </Fab>        
        <div
            onClick={handleOnClose}
            id="container"
            className={
              openedChat
                ? "fixed z-50 inset-0 backdrop-blur-sm bg-black bg-opacity-30"
                : "w-[100%] sm:w-[37.5%] max-h-full bg-white rounded-lg mt-5 sm:mt-0 hidden  sm:inline "
            }
          >
            <section
              className={
                openedChat
                  ? "flex flex-col h-5/6  bg-white"
                  : "w-[100%] sm:w-[37.5%] max-h-full bg-white rounded-lg mt-5 sm:mt-0 hidden  sm:inline "
              }
            >
          <div
            className="overflow-y-scroll"
            id="scroll"
            style={{ height: "90%" }}
          >
            {history.map((h) => {
              return (
                <div key={h.id}>
                  <div className="px-4 py-2">
                    <div
                      className={`flex flex-col ${h.name === `${props.auth.name} ${props.auth.surname}`
                        ? "items-end text-right"
                        : "items-start text-left"
                        }`}
                    >
                      <div className="flex justify-center items-center">
                        <h4
                          className={`text-lg text-primary ${robotoBold.className} ml-2`}
                        >
                          {h.name}
                        </h4>
                      </div>
                      <p className="line-clamp-3 mt-[2px] w-3/4">{h.message}</p>
                    </div>
                    <div
                      className="bg-emerald-200 w-full mt-1"
                      style={{ height: "1px" }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <form
            className="flex justify-center items-center m-2 text-primary"
            onSubmit={handleSubmit}
          >
            <Input
              className="w-full"
              placeholder="Escriba un texto"
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="scroll"
            />
            <FaPaperPlane
              className="hover:cursor-pointer hover:opacity-70"
              onClick={handleSubmit}
            />
          </form>
        </section>
        </div>
        <Dialog
          open={cancelDialog}
          onClose={() => setCancelDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={`${robotoBold.className} text-red-600`} id="alert-dialog-title">
            Salir de Videollamada
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro que deseas salir de la videollamada? No podrás volver a conectarte luego de abandonar la misma.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" variant="text" onClick={() => setCancelDialog(false)}>Cancelar</Button>
            <Button onClick={leaveSession} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
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
  { protected: true }
);
