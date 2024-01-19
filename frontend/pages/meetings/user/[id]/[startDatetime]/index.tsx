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
import Meeting from "@/components/meeting";
import Input from "@/components/input";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa6";
import { useEffect, useState } from "react";

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
  const [submit, setSubmit] = useState("");

  async function handleClick() {
    const token = props.token;
    const { id, startDatetime } = router.query;

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
    router.push(`/meetings/user/${id}/${startDatetime}`);

    setTimeout(() => {
      const scrollBar = document.getElementById("test");
      if (scrollBar) {
        scrollBar.scrollTop = 20000;
      }
    }, 240);
  }

  function handleSubmit(e: any) {
    e.preventDefault()
    handleClick();
  };

  useEffect(() => {
    const scrollBar = document.getElementById("test");
    if (scrollBar) {
      scrollBar.scrollTop = 20000;
    }
  }, []);

  return (
    <Layout auth={props.auth} className="flex flex-col justify-center">
      <main
        className="flex justify-between gap-4 overflow-hidden m-4"
        style={{ height: "85%" }}
      >
        <section className="w-1/4 h-full">
          <Meeting
            id={props.meeting.id}
            startDatetime={props.meeting.startDatetime}
            doctor={props.meeting.doctor}
            user={props.meeting.user}
            speciality={props.meeting.speciality}
            status={props.meeting.status}
          />
        </section>
        <section className="w-1/2"></section>
        <section className="w-1/4 max-h-full bg-white rounded-lg">
          <div className="overflow-scroll" id="test" style={{ height: "90%" }}>
            {props.comments.map((comment) => {
              return (
                <>
                  <Comment
                    comment={comment.comment}
                    datetime={comment.datetime}
                    user={comment.user}
                    auth={props.auth}
                  />
                </>
              );
            })}
          </div>
          <form
            className="flex justify-center items-center m-2 text-primary"
            action="" onSubmit={handleSubmit}
          >
            <Input
              placeholder="Escriba un texto"
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="test"
            />
            <FaPaperclip
              className="mx-2 hover:cursor-pointer"
              onClick={handleClick}
            />
            <FaPaperPlane
              className="hover:cursor-pointer"
              onClick={handleClick}
            />
          </form>
        </section>
      </main>
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
