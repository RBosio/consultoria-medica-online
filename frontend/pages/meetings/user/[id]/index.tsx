import withAuth from "@/lib/withAuth";
import { Auth } from "../../../../../shared/types";
import axios from "axios";
import Layout from "@/components/layout";
import {
  Autocomplete,
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
import { ChangeEvent, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaUserDoctor } from "react-icons/fa6";
import Input from "@/components/input";
import { useFormik } from "formik";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import Button from "@/components/button";
import { IoMdSearch } from "react-icons/io";

interface Test {
  auth: Auth;
  meetings: MeetingResponseDto[];
  meetingsFiltered: MeetingResponseDto[];
  specialities: SpecialityResponseDto[];
}

export default function Home(props: Test) {
  const theme = useTheme();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);

  const back = () => {
    const carouselInner = document.getElementById("carouselInner");
    if (index > 0) {
      setIndex(index - 1);
      if (carouselInner) {
        carouselInner.style.transform = `translateX(${position + 100}%)`;
      }
      setPosition(position + 100);
    }
  };

  const next = () => {
    const carouselInner = document.getElementById("carouselInner");
    if (index < Math.ceil(props.meetings.length / 4) - 1) {
      setIndex(index + 1);
      if (carouselInner) {
        carouselInner.style.transform = `translateX(${position - 100}%)`;
      }
      setPosition(position - 100);
    }
  };

  const testss = (length: number) => {
    for (let index = 0; index < length; index++) {
      <>
        <div className="w-4 h-4 rounded-full bg-secondary"></div>
      </>;
    }
  };

  const filtersForm = useFormik({
    initialValues: {
      name: "",
      specialityId: "",
      status: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const carouselInner = document.getElementById("carouselInner");
      if (carouselInner) {
        carouselInner.style.transition = "none";
        carouselInner.style.transform = `translateX(0%)`;
      }

      setIndex(0);
      setPosition(0);
      const id = router.query.id;
      router.push(
        `/meetings/user/${id}?${new URLSearchParams(values).toString()}`
      );
      setTimeout(() => {
        if (carouselInner) {
          carouselInner.style.transition = "all ease-in .5s";
        }
      }, 1000);
      setSubmitting(false);
    },
  });

  return (
    <Layout auth={props.auth}>
      <main>
        <form
          className="flex justify-between items-center bg-white p-6 shadow-md gap-12"
          onSubmit={filtersForm.handleSubmit}
        >
          <div className="w-1/3">
            <Input
              name="name"
              onChange={filtersForm.handleChange}
              startadornment={
                <FaUserDoctor color={theme.palette.primary.main} />
              }
              fullWidth
              label="Nombre"
            />
          </div>
          <div className="w-1/3">
            <Autocomplete
              onChange={(event, newValue: any) => {
                filtersForm.setFieldValue(
                  "specialityId",
                  newValue ? newValue.id : ""
                );
              }}
              disablePortal
              noOptionsText="Especialidad no encontrada"
              options={props.specialities.map((spec: any) => ({
                id: spec.id,
                label: spec.name,
              }))}
              renderInput={(params: any) => (
                <Input
                  onChange={filtersForm.handleChange}
                  name="specialityId"
                  {...params}
                  label="Especialidad"
                />
              )}
            />
          </div>
          <div className="w-1/3">
            <Autocomplete
              onChange={(event, newValue: any) => {
                filtersForm.setFieldValue(
                  "status",
                  newValue ? newValue.id : ""
                );
              }}
              disablePortal
              noOptionsText="Estado no encontrado"
              options={[
                { id: "Pendiente", label: "Pendiente" },
                { id: "Finalizada", label: "Finalizada" },
                { id: "Cancelada", label: "Cancelada" },
              ]}
              renderInput={(params: any) => (
                <Input
                  onChange={filtersForm.handleChange}
                  name="status"
                  {...params}
                  label="Estado"
                />
              )}
            />
          </div>
          <Button type="submit" size="large" startIcon={<IoMdSearch />}>
            Buscar
          </Button>
        </form>
        <section>
          <div className="w-[95%] overflow-hidden m-auto relative px-[14px]">
            <div
              className="flex flex-nowrap items-center transition-all ease-in"
              style={{ transitionDuration: ".5s" }}
              id="carouselInner"
            >
              {props.meetingsFiltered.map((meeting: MeetingResponseDto) => {
                return (
                  <Meeting
                    key={meeting.id}
                    id={meeting.id}
                    startDatetime={meeting.startDatetime}
                    user={meeting.user}
                    doctor={meeting.doctor}
                    speciality={meeting.speciality}
                  />
                );
              })}
              ;
            </div>
            <div className="flex justify-center">
              {props.meetings.length / 4 > 1
                ? ""
                : ""}
            </div>
            <button
              onClick={() => {
                back();
              }}
            >
              <FaChevronLeft
                className="text-primary text-4xl absolute -left-1 hover:cursor-pointer hover:opacity-30"
                style={{ top: "45%" }}
              />
            </button>
            <button
              onClick={() => {
                next();
              }}
            >
              <FaChevronRight
                className="text-primary text-4xl absolute -right-1 hover:cursor-pointer hover:opacity-30"
                style={{ top: "45%" }}
              />
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { query } = context;
    const { id, ...q } = query;

    try {
      let meetings = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/meeting/user/${id}?${new URLSearchParams(q).toString()}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      meetings = meetings.data;

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
          meetings,
          meetingsFiltered: meetings,
          specialities,
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
