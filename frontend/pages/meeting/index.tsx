import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import Layout from "@/components/layout";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaXmark,
} from "react-icons/fa6";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import { UserResponseDto } from "@/components/dto/user.dto";
import { VideoClient } from "@zoom/videosdk";

interface MeetingI {
  auth: Auth;
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

      await stream.startAudio();
      await stream.unmuteAudio();
    }
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

    client.on("user-added", (payload) => {
      console.log(payload[0].userId + " joined the session");
    });

    client.on("user-removed", (payload) => {
      if (payload[0]) {
        console.log(payload[0].userId + " left the session");
      }
    });

    if (
      ZoomVideo.checkSystemRequirements().video &&
      ZoomVideo.checkSystemRequirements().audio
    ) {
      await client.init("en-US", "Global", { patchJsMedia: true });

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
        videoElement: myVideo
      })
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
        <div className="w-1/4 h-[calc(100%-30px)] my-4 mr-4 bg-white rounded-lg">
          <div></div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    const token = context.req.cookies.token;
    return {
      props: {
        auth,
        token,
      },
    };
  },
  true
);
