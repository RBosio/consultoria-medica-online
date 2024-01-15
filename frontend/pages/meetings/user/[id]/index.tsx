import withAuth from "@/lib/withAuth";
import { Auth } from "../../../../../shared/types";
import axios from "axios";
import Layout from "@/components/layout";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import Meeting from "@/components/meeting";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Home(props: any) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Layout auth={props.auth}>
      <section className="h-full">
        <div className="w-[95%] overflow-hidden m-auto relative px-[14px]">
          <div className="flex flex-nowrap items-center">
            {props.meetings.map((meeting: any) => {
              return (
                <Meeting
                  key={meeting.id}
                  startDatetime={meeting.startDatetime}
                  user={meeting.user}
                  doctor={meeting.doctor}
                  speciality={meeting.speciality}
                />
              );
            })}
          </div>
          <FaChevronLeft className="text-primary text-4xl absolute -left-1 hover:cursor-pointer hover:opacity-30" style={{top: "45%"}} />
          <FaChevronRight className="text-primary text-4xl absolute -right-1 hover:cursor-pointer hover:opacity-30" style={{top: "45%"}} />
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    const { query } = context;
    const id = query.id;

    try {
      let meetings = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/user/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      meetings = meetings.data;

      return {
        props: {
          meetings,
          auth,
        },
      };
    } catch {
      return {
        props: {
          doctors: { items: [] },
          auth,
        },
      };
    }
  },
  true
);
