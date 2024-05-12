import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import axios from "axios";
import Layout from "@/components/layout";
import {
  Fab,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import Comment from "@/components/comment";
import { CommentResponseDto } from "@/components/dto/comment.dto";
import Input from "@/components/input";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import {
  FaCalendarDays,
  FaClock,
  FaPaperPlane,
  FaPaperclip,
  FaPlay,
  FaXmark,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import { robotoBold } from "@/lib/fonts";
import Button from "@/components/button";
import UserCard from "@/components/userCard";
import DoctorCard from "@/components/doctorCard";

interface MeetingI {
  meeting: MeetingResponseDto;
  comments: CommentResponseDto[];
  specialities: SpecialityResponseDto[];
  auth: Auth;
}

export default function DetailMeeting(props: MeetingI) {
  const theme = useTheme();
  const router = useRouter();

  const [text, setText] = useState("");
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<string>("");
  const [motive, setMotive] = useState<string>("");
  const [showMotive, setShowMotive] = useState<boolean>(false);
  const [openedChat, setOpenedChat] = useState(false);

  useEffect(() => {
    moment.locale("es");
  }, []);

  const handleOnClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === "container") {
      setOpenedChat(false);
    }
  };

  async function handleClickComment() {
    const token = props.auth.token;
    const { id } = router.query;

    if (id && typeof id === "string") {
      const [t, startDatetime] = atob(id).split(".");
      let band: boolean = false;

      if (text.length > 0) {
        const comment = {
          datetime: new Date(),
          meetingUserId: t,
          meetingStartDatetime: startDatetime,
          comment: text,
          userCommentId: props.auth.id,
        };
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/comment`,
          comment,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setText("");
        band = true;
      } else {
        if (
          type.includes("office") ||
          type.includes("pdf") ||
          type.includes("jpg") ||
          type.includes("jpeg") ||
          type.includes("png")
        ) {
          const comment = {
            datetime: new Date(),
            meetingUserId: t,
            meetingStartDatetime: startDatetime,
            comment: "",
            userCommentId: props.auth.id,
          };
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/comment`,
            comment,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const c = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/comment/${t}`,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", type);
          formData.append("commentId", res.data.id);
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/comment/${t}/${moment(
              c.data.datetime
            ).format("YYYY-MM-DDTHH:mm:ss")}/file`,
            formData,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          band = true;
        }
      }

      router.push(`/meetings/${id}`);

      setTimeout(() => {
        const scrollBar = document.getElementById("scroll");
        if (scrollBar) {
          scrollBar.scrollTop = 20000;
        }
      }, 240);

      setFile("");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notification`,
        {
          userIdSend: props.auth.id,
          userIdReceive:
            props.auth.role === "user"
              ? props.meeting.doctor.user.id
              : props.meeting.user.id,
          type: "comment",
          meetingUserId: t,
          meetingStartDatetime: startDatetime,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
    }
  }

  function handleClickFile() {
    const file = document.getElementById("file");
    file?.click();
  }

  function handleChange($e: any) {
    if ($e.target.files && $e.target.files[0]) {
      setFile($e.target.files[0]);
      setType($e.target.files[0].type);
    }
  }

  function xHandleClick() {
    setFile("");
  }

  function showMotiveHandleClick() {
    setShowMotive(!showMotive);
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    handleClickComment();
  }

  useEffect(() => {
    const scrollBar = document.getElementById("scroll");
    if (scrollBar) {
      scrollBar.scrollTop = 20000;
    }
  }, []);

  return (
    <Layout auth={props.auth} className="flex flex-col justify-center relative">
      <>
        <main className="flex flex-col md:flex-row flex-wrap sm:flex-nowrap justify-between gap-1 sm:gap-4 m-4">
          <section
            className="md:mt-0 w-full md:w-1/2 h-5/12 sm:h-full"
          >
            {props.auth.role === "user" ? (
              <DoctorCard
                startDatetime={props.meeting.startDatetime}
                doctor={props.meeting.doctor}
                user={props.meeting.user}
                specialities={props.specialities}
                status={props.meeting.status}
                motive={props.meeting.motive}
                tpc={props.meeting.tpc}
                price={props.meeting.price}
              />
            ) : (
              <UserCard
                startDatetime={props.meeting.startDatetime}
                doctor={props.meeting.doctor}
                user={props.meeting.user}
                specialities={props.specialities}
                status={props.meeting.status}
                motive={props.meeting.motive}
                tpc={props.meeting.tpc}
                price={props.meeting.price}
              />
            )}
          </section>
          <section className="md:w-[48%] flex flex-col items-center sm:gap-4 mt-4 md:mt-0">
            <section className="w-full bg-white rounded-lg flex flex-col items-center">
              <div className="w-full relative">
                <div className="w-full h-full bg-black absolute opacity-30 rounded-t-lg"></div>
                <img
                  className="object-cover object-center rounded-t-lg"
                  src="/assets/wallpaper.webp"
                />
              </div>
              <div className="border-b border-b-emerald-800 text-white bg-emerald-600 flex justify-center items-center mt-2 p-1 rounded-lg w-[90%]">
                <FaCalendarDays />
                <p className="ml-1 text-sm sm:text-base">
                  {moment(props.meeting.startDatetime).format("LLLL")}
                </p>
              </div>
              <div className="flex items-center m-2">
                <p className="text-zinc-800">{props.meeting.status}</p>
              </div>
              <div className="w-3/4 h-2 border-t-2 border-emerald-200 mb-3"></div>
              <div className="flex justify-end items-center w-full mb-2">
                {props.auth.role === "user" ? (
                  <div className="m-2">
                    <Button
                      className="bg-green-600 hover:bg-green-800 mr-2"
                      size="small"
                      startIcon={<FaPlay />}
                      disabled={
                        props.meeting.status !== "Pagada" ||
                        (!(
                          Date.now() >
                          moment(props.meeting.startDatetime)
                            .subtract(10, "minutes")
                            .toDate()
                            .getTime()
                        ) &&
                          Date.now() <
                          moment(props.meeting.startDatetime)
                            .add(
                              props.meeting.doctor.durationMeeting + 10,
                              "minutes"
                            )
                            .toDate()
                            .getTime())
                      }
                      onClick={() =>
                        router.push(`/meetings/${router.query.id}/videocall`)
                      }
                    >
                      Unirse
                    </Button>
                    {props.meeting.status === "Pagada" && <Button
                      size="small"
                      startIcon={<FaClock />}
                      onClick={() => {
                        localStorage.setItem(
                          "repr",
                          JSON.stringify(props.meeting.startDatetime)
                        );
                        router.push(`/doctors/${props.meeting.doctor.id}`);
                      }}
                    >
                      Reprogramar
                    </Button>}
                  </div>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-800 mr-2"
                    size="small"
                    startIcon={<FaPlay />}
                    disabled={
                      (props.meeting.status !== "Pendiente" &&
                        props.meeting.status !== "Pagada") ||
                      (!(
                        Date.now() >
                        moment(props.meeting.startDatetime)
                          .subtract(10, "minutes")
                          .toDate()
                          .getTime()
                      ) &&
                        Date.now() <
                        moment(props.meeting.startDatetime)
                          .add(
                            props.meeting.doctor.durationMeeting + 10,
                            "minutes"
                          )
                          .toDate()
                          .getTime())
                    }
                    onClick={() =>
                      router.push(`/meetings/${router.query.id}/videocall`)
                    }
                  >
                    Iniciar reunión
                  </Button>
                )}
              </div>
            </section>
          </section>
          <Fab
            color="primary"
            onClick={() =>
              openedChat ? setOpenedChat(false) : setOpenedChat(true)
            }
            aria-label="chat"
            className="z-0 bg-secondary hover:bg-[#4F4F4F] fixed bottom-4 right-8 text-white md:hidden"
          >
            <BsFillChatLeftTextFill />
          </Fab>
          <div
            onClick={handleOnClose}
            id="container"
            className={`
            ${openedChat
                ? "fixed z-50 inset-0 backdrop-blur-sm bg-black bg-opacity-30"
                : "w-[100%] sm:w-[40%] bg-white rounded-lg mt-5 sm:mt-0 hidden md:inline h-[600px]"
              }
              `}
          >
            <section
              className={`
              ${openedChat
                  ? "flex flex-col h-5/6 bg-white"
                  : "w-[100%] sm:w-[40%] rounded-lg mt-5 sm:mt-0 hidden md:inline"
                }
              `}
            >
              <div className="overflow-y-scroll h-[85%]" id="scroll">
                {props.comments.map(
                  (comment: CommentResponseDto, idx: number) => {
                    return (
                      <Comment
                        key={idx}
                        comment={comment.comment}
                        datetime={comment.datetime}
                        user={comment.user}
                        auth={props.auth}
                        files={comment.files}
                      />
                    );
                  }
                )}
              </div>
              <form
                className="flex justify-center items-center text-primary mx-auto my-4 w-5/6"
                onSubmit={handleSubmit}
              >
                {file ? (
                  <div
                    className={`w-full py-1 px-2 bg-primary rounded-md text-white flex justify-between items-center overflow-x-hidden h-8 ${file.name.length > 60 ? "overflow-y-scroll" : ""
                      }`}
                  >
                    <div className={`${robotoBold.className}`}>{file.name}</div>
                    <FaXmark
                      className="hover:cursor-pointer hover:opacity-70"
                      onClick={xHandleClick}
                    />
                  </div>
                ) : (
                  <Input
                    className="w-full"
                    placeholder="Escriba un texto"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    id="scroll"
                  />
                )}
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleChange}
                />
                <FaPaperclip
                  className="mx-2 hover:cursor-pointer hover:opacity-70"
                  onClick={handleClickFile}
                />
                <FaPaperPlane
                  className="hover:cursor-pointer hover:opacity-70"
                  onClick={handleClickComment}
                />
              </form>
            </section>
          </div>
        </main>
      </>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { id } = context.query;

    const [t, startDatetime] = atob(id).split(".");

    try {
      let meeting = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/${t}/${startDatetime}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      meeting = meeting.data;

      let comments = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/meeting/${t}/${startDatetime}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      comments = comments.data;

      let specialities = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/speciality`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      specialities = specialities.data;

      return {
        props: {
          meeting,
          comments,
          specialities,
          auth,
        },
      };
    } catch {
      return {
        redirect: {
          destination: "/meetings",
          permanent: false,
        },
      };
    }
  },
  { protected: true }
);
