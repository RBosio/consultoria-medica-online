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
import axios from "axios";

export default function Meeting(props: any) {
  const theme = useTheme();
  const router = useRouter();

  let client: typeof VideoClient;

  const [meet, setMeet] = useState<any>();
  const [doctor, setDoctor] = useState<DoctorResponseDto>();
  const [user, setUser] = useState<UserResponseDto>();
  const [audio, setAudio] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const t: any[] = [];


  async function join(){
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
  };

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

  return (
    <Layout renderSidebar={false} auth={props.auth}>
      <div className="flex h-full">
        <div className="w-full flex flex-col justify-center items-center xl:p-5">
          <div className="relative w-[500px] h-[281px] md:w-[650px] md:h-[365px] lg:w-[700px] lg:h-[394px] xl:w-[900px] xl:h-[506px]">
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
              className="bg-gray-600"
              style={{ width: "100%", height: "100%" }}
            ></video>
            <p className="absolute bottom-0 right-0 text-white mr-2">
              {props.auth.role !== "user"
                ? `${user ? user.name : ""} ${user ? user.surname : ""}`
                : `${doctor ? doctor.user.name : ""} ${doctor ? doctor.user.surname : ""
                }`}
            </p>
            <div className="w-full h-auto flex flex-col p-2 gap-6 absolute left-4 top-1/2 translate-y-[-50%]">
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
        </div>
        <section className="w-2/6 h-[calc(100%-30px)] my-4 mr-4 bg-white rounded-lg">
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
  {protected: true}
);
