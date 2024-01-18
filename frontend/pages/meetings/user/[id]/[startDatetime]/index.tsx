import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import axios from "axios";
import Layout from "@/components/layout";
import { Autocomplete, useTheme } from "@mui/material";
import Meeting from "@/components/meeting";
import { useRouter } from "next/router";
import { FaChevronLeft, FaChevronRight, FaUserDoctor } from "react-icons/fa6";
import Input from "@/components/input";
import { useFormik } from "formik";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import Comment from "@/components/comment";

interface Meeting {
  meeting: MeetingResponseDto;
  auth: Auth;
  speciality: SpecialityResponseDto;
}

export default function Home(props: Meeting) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Layout auth={props.auth} className="flex flex-col justify-center">
      <main className="flex justify-between gap-4 overflow-hidden m-4">
        <section className="w-1/4">
          <Meeting
            id={props.meeting.id}
            startDatetime={props.meeting.startDatetime}
            doctor={props.meeting.doctor}
            user={props.meeting.user}
            speciality={props.meeting.speciality}
            status={props.meeting.status}
          />
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { id, startDatetime } = context.query;

    try {
      let meeting = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/${id}/${startDatetime}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      meeting = meeting.data;

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
          specialities,
          auth,
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
