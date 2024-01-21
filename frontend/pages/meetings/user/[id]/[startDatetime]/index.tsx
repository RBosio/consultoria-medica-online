import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import axios from "axios";
import Layout from "@/components/layout";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import Comment from "@/components/comment";
import { CommentResponseDto } from "@/components/dto/comment.dto";
import CardDoctor from "@/components/doctorCard";
import Input from "@/components/input";
import {
  FaCalendarDays,
  FaCheck,
  FaCircleInfo,
  FaPaperPlane,
  FaPaperclip,
  FaPlay,
  FaXmark,
} from "react-icons/fa6";
import { useEffect, useState } from "react";
import moment from "moment";
import { robotoBold } from "@/lib/fonts";
import Button from "@/components/button";
import UserCard from "@/components/userCard";

interface MeetingI {
  meeting: MeetingResponseDto;
  comments: CommentResponseDto[];
  speciality: SpecialityResponseDto;
  auth: Auth;
  token: string;
}

export default function Home(props: MeetingI) {
  const theme = useTheme();
  const router = useRouter();

  const [text, setText] = useState("");
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<string>("");
  const [motive, setMotive] = useState<string>("");
  const [showMotive, setShowMotive] = useState<boolean>(false);
  const [cancel, setCancel] = useState<boolean>(false);

  async function handleClickComment() {
    const token = props.token;
    const { id, startDatetime } = router.query;

    if (text.length > 0) {
      const comment = {
        datetime: new Date(),
        meetingUserId: id,
        meetingStartDatetime: startDatetime,
        comment: text,
        userCommentId: props.auth.id,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment`, comment, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      setText("");
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
          meetingUserId: id,
          meetingStartDatetime: startDatetime,
          comment: "",
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

        const c = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/comment/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/comment/${id}/${moment(
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
      }
    }

    router.push(`/meetings/user/${id}/${startDatetime}`);

    setTimeout(() => {
      const scrollBar = document.getElementById("scroll");
      if (scrollBar) {
        scrollBar.scrollTop = 20000;
      }
    }, 240);
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

  function motiveHandleChange($e: any) {
    setMotive($e.target.value);
  }

  function xHandleClick() {
    setFile("");
  }

  async function motiveHandleClick() {
    const { id, startDatetime } = router.query;
    const token = props.token;

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/meeting/cancel/${id}/${startDatetime}`,
      { motive },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCancel(false);
    props.meeting.status = "Cancelada";
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
        {showMotive ? (
          <>
            <div className="w-full flex justify-end absolute top-2 right-2 z-50">
              <FaXmark
                className="text-primary text-3xl text-right m-4 hover:cursor-pointer border border-primary hover:bg-primary hover:text-white"
                onClick={showMotiveHandleClick}
              />
            </div>
            <div className="bg-black opacity-70 w-full h-full absolute z-20 flex justify-center items-center"></div>
            <div className="w-full h-full absolute z-40 top-0 left-0 flex justify-center items-center">
              <div className="w-1/4 h-1/4 bg-white rounded-lg">
                <h4
                  className={`${robotoBold.className} text-lg text-primary text-center mt-2`}
                >
                  Motivo de cancelacion
                </h4>
                <div className="w-[90%] h-[40%] m-auto">
                  <p className="w-full h-full border border-primary my-2 p-2 rounded-lg overflow-y-scroll">
                    {motive ? motive : props.meeting.motive}
                  </p>
                  <div className="text-gray-500 text-xs mt-2 flex justify-end">
                    {props.meeting.cancelDate ? moment(props.meeting.cancelDate).format(
                      "DD/MM/YYYY HH:mm"
                    ): moment(new Date()).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <main
          className="flex justify-between gap-4 overflow-hidden m-4"
          style={{ height: "85%" }}
        >
          <section className="w-1/4 h-full">
            {props.auth.role === "user" ? (
              <CardDoctor
                id={props.meeting.id}
                startDatetime={props.meeting.startDatetime}
                doctor={props.meeting.doctor}
                user={props.meeting.user}
                speciality={props.meeting.speciality}
                status={props.meeting.status}
                motive={props.meeting.motive}
              />
            ) : (
              <UserCard
                id={props.meeting.id}
                startDatetime={props.meeting.startDatetime}
                doctor={props.meeting.doctor}
                user={props.meeting.user}
                speciality={props.meeting.speciality}
                status={props.meeting.status}
                motive={props.meeting.motive}
              />
            )}
          </section>
          <section className="w-[37.5%] flex flex-col items-center gap-4">
            <section className="w-full h-2/3 bg-white rounded-lg flex flex-col items-center">
              <div className="w-full relative">
                <div className="w-full h-full bg-black absolute opacity-30 rounded-t-lg"></div>
                <img
                  className="object-cover object-center rounded-t-lg"
                  src="/assets/wallpaper.webp"
                />
              </div>
              <div className="border-b border-b-emerald-800 text-white bg-emerald-600 flex justify-center items-center mt-2 p-1 rounded-lg w-[90%]">
                <FaCalendarDays />
                <p className="ml-1">
                  {moment(props.meeting.startDatetime).format(
                    "LLLL"
                  )}
                </p>
              </div>
              <div className="flex items-center m-2">
                <p className="text-zinc-800">{props.meeting.status}</p>
                {props.meeting.status === "Cancelada" ? (
                  <FaCircleInfo
                    className="ml-2 text-primary hover:cursor-pointer hover:opacity-70 text-lg"
                    onClick={showMotiveHandleClick}
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="w-3/4 h-2 border-t-2 border-emerald-200 mb-3"></div>

              <div className="flex justify-end items-center w-full mb-2">
                {props.auth.role === "user" ? (
                  <Button
                    className="bg-green-600 hover:bg-green-800 mr-2"
                    size="small"
                    endIcon={<FaPlay />}
                    disabled={props.meeting.status !== "Pendiente"}
                  >
                    Unirse
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-800 mr-2"
                    size="small"
                    endIcon={<FaPlay />}
                    disabled={props.meeting.status !== "Pendiente"}
                  >
                    Iniciar reunion
                  </Button>
                )}
                {props.meeting.status === "Pendiente" ? (
                  <Button
                    className="bg-red-600 hover:bg-red-800 mr-2"
                    size="small"
                    endIcon={<FaXmark />}
                    onClick={() => setCancel(true)}
                  >
                    Cancelar
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </section>
            {cancel ? (
              <section className="w-full h-1/3 bg-white rounded-lg">
                <form
                  className="h-full flex flex-col justify-center items-center"
                  onSubmit={() => handleSubmit}
                >
                  <Input
                    id="outlined-multiline-static"
                    label="Motivo"
                    multiline
                    rows={2}
                    placeholder="Ingrese un motivo"
                    className="w-[90%]"
                    onChange={motiveHandleChange}
                  />
                  <Button
                    className="mt-2"
                    size="small"
                    endIcon={<FaCheck />}
                    onClick={motiveHandleClick}
                  >
                    Aceptar
                  </Button>
                </form>
              </section>
            ) : (
              ""
            )}
          </section>
          <section className="w-[37.5%] max-h-full bg-white rounded-lg">
            <div
              className="overflow-scroll"
              id="scroll"
              style={{ height: "90%" }}
            >
              {props.comments.map((comment) => {
                return (
                  <>
                    <Comment
                      comment={comment.comment}
                      datetime={comment.datetime}
                      user={comment.user}
                      auth={props.auth}
                      files={comment.files}
                    />
                  </>
                );
              })}
            </div>
            <form
              className="flex justify-center items-center m-2 text-primary"
              onSubmit={() => handleSubmit}
            >
              {file ? (
                <div
                  className={`w-full py-1 px-2 bg-primary rounded-md text-white flex justify-between items-center overflow-x-hidden h-8 ${
                    file.name.length > 60 ? "overflow-y-scroll" : ""
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
        </main>
      </>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { id, startDatetime } = context.query;
    const token = context.req.cookies.token;

    try {
      let meeting = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/${id}/${startDatetime}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      meeting = meeting.data;

      let comments = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/meeting/${id}/${startDatetime}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      comments = comments.data;

      let specialities = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/speciality`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      specialities = specialities.data;

      return {
        props: {
          meeting,
          comments,
          specialities,
          auth,
          token,
        },
      };
    } catch {
      return {
        props: {
          meeting: { items: {} },
          auth,
        },
      };
    }
  },
  true
);
