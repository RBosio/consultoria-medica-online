import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import Layout from "@/components/layout";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaVideo,
  FaVideoSlash,
  FaXmark,
} from "react-icons/fa6";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import { UserResponseDto } from "@/components/dto/user.dto";
import { VideoClient } from "@zoom/videosdk";
import Input from "@/components/input";
import { robotoBold } from "@/lib/fonts";

interface MeetingI {
  auth: Auth;
  user: UserResponseDto;
  token: string;
}

export default function Meeting(props: MeetingI) {
  const theme = useTheme();
  const router = useRouter();

  let client: typeof VideoClient;

  const [doctor, setDoctor] = useState<DoctorResponseDto>();
  const [user, setUser] = useState<UserResponseDto>();
  const [audio, setAudio] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const t: any[] = [];

  const setNames = () => {
    let doctor = localStorage.getItem("doctor");
    let user = localStorage.getItem("user");
    if (doctor && user) {
      const d = JSON.parse(doctor);
      const u = JSON.parse(user);
      setDoctor(d);
      setUser(u);
    }
  };

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
    const ZoomVideo = await (await import("@zoom/videosdk")).default;

    setNames();
    const tpc = localStorage.getItem("tpc");
    const token = localStorage.getItem("tokenMeeting");

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

      if (tpc && token) {
        await joinMeeting(tpc, token, myVideo, otherCanvas);
      }
    }
  };

  useEffect(() => {
    meeting()
      .then((res) => {})
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

  return (
    <Layout auth={props.auth}>
      <div className="flex h-full">
        <div className="w-3/4 m-4">
          <div className="w-1/3 mx-auto mb-2">
            <div className="relative">
              <video
                id="my-video"
                className="w-[320px] h-[180px] bg-gray-800"
                style={{ width: "100%", height: "auto" }}
              ></video>
              <p className="absolute bottom-0 right-0 text-white mr-2">
                {`${props.auth.name} ${props.auth.surname} (You)`}
              </p>
            </div>
          </div>
          <div className="relative">
            <canvas
              id="other-canvas"
              className="w-[768px] h-[432px] bg-gray-600"
              style={{ width: "100%", height: "auto" }}
            ></canvas>
            <p className="absolute bottom-0 right-0 text-white mr-2">
              {props.auth.role !== "user"
                ? `${user ? user.name : ""} ${user ? user.surname : ""}`
                : `${doctor ? doctor.user.name : ""} ${
                    doctor ? doctor.user.surname : ""
                  }`}
            </p>
          </div>
          <div className="w-full h-auto flex justify-center p-2 gap-6">
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
              onClick={leaveSession}
            >
              <FaXmark className="text-xl" />
            </div>
          </div>
        </div>
        <section className="w-1/4 h-[calc(100%-30px)] my-4 mr-4 bg-white rounded-lg">
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
                      className={`flex flex-col ${
                        h.name === `${props.auth.name} ${props.auth.surname}`
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
  true
);
