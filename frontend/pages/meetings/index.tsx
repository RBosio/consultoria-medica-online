import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Layout from "@/components/layout";
import { Autocomplete, useTheme } from "@mui/material";
import CardMeeting from "@/components/meetingCard";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaUserDoctor } from "react-icons/fa6";
import Input from "@/components/input";
import { useFormik } from "formik";
import { MeetingResponseDto } from "@/components/dto/meeting.dto";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import Button from "@/components/button";
import { IoMdSearch } from "react-icons/io";

interface Meeting {
  auth: Auth;
  meetings: MeetingResponseDto[];
  specialities: SpecialityResponseDto[];
}

export default function Meetings(props: Meeting) {
  const theme = useTheme();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  let i: number = 5;
  let page: number = 0;

  const back = () => {
    const carouselInner = document.getElementById("carouselInner");
    if (index > 0) {
      setIndex(index - 1);
      if (carouselInner) {
        carouselInner.style.transform = `translateX(${position + 100}%)`;
      }
      setPosition(position + 100);
      page = index;
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
      page = index;
    }
  };

  const points = (ind: number) => {
    if (ind + 1 == i) {
      i += 4;
      page++;
      return (
        <div
          key={page.toString()}
          onClick={handleClick}
          id={page.toString()}
          className={`w-4 h-4 rounded-full ${
            page == index ? "bg-secondary" : "bg-primary"
          } m-2 hover:cursor-pointer`}
        ></div>
      );
    }
  };

  function handleClick($e: any) {
    page = Number($e.target.id);
    const carouselInner = document.getElementById("carouselInner");
    setIndex(page);
    if (carouselInner) {
      if (page == 0) {
        setPosition(0);
        carouselInner.style.transform = `translateX(0%)`;
      } else {
        setPosition(-100 * page);
        carouselInner.style.transform = `translateX(${-100 * page}%)`;
      }
    }
  }

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
      router.push(
        `/meetings/?${new URLSearchParams(values).toString()}`
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
          <div className={`${props.auth.role === "user" ? "w-1/3" : "w-1/2"}`}>
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
          <div className={`${props.auth.role === "user" ? "w-1/3" : "hidden"}`}>
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
          <div className={`${props.auth.role === "user" ? "w-1/3" : "w-1/2"}`}>
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
          <div className="w-[95%] overflow-hidden m-auto relative px-[14px] mt-8">
            <div
              className="flex flex-nowrap items-center transition-all ease-in"
              style={{ transitionDuration: ".5s" }}
              id="carouselInner"
            >
              {props.meetings.length === 0 ? (
                <h2 className="text-xl">No se encontraron resultados</h2>
              ) : (
                ""
              )}
              {props.meetings.map((meeting: MeetingResponseDto, idx: number) => {
                return (
                  <CardMeeting
                    key={idx}
                    id={idx}
                    startDatetime={meeting.startDatetime}
                    status={meeting.status}
                    user={meeting.user}
                    doctor={meeting.doctor}
                    specialities={meeting.doctor.specialities}
                    auth={props.auth}
                  />
                );
              })}
            </div>
            <div className="flex justify-center">
              {props.meetings.length / 4 > 1 ? (
                <div
                  onClick={handleClick}
                  id={page.toString()}
                  className={`w-4 h-4 rounded-full ${
                    page === index ? "bg-secondary" : "bg-primary"
                  } m-2 hover:cursor-pointer`}
                ></div>
              ) : (
                ""
              )}

              {props.meetings.length / 4 > 1
                ? props.meetings.map((m, i) => {
                    return points(i);
                  })
                : ""}
            </div>
            {props.meetings.length / 4 > 1 ? (
              <>
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
              </>
            ) : (
              ""
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let { query } = context;

    try {
      let meetings;
      if (auth?.role === "user") {
        meetings = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/meeting/user/${auth?.id}?${new URLSearchParams(query).toString()}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${context.req.cookies.token}` },
          }
        );
      } else {
        meetings = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/meeting/doctor/${auth?.id}?${new URLSearchParams(query).toString()}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${context.req.cookies.token}` },
          }
        );
      }

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
          specialities,
          auth,
        },
      };
    } catch {
      return {
        props: {
          meetings: { items: [] },
          auth,
        },
      };
    }
  },
  true
);
