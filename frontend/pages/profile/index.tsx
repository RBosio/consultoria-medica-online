import React from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Avatar from "@/components/avatar";
import {
  FaAddressCard,
  FaCalendarDays,
  FaCheck,
  FaEnvelope,
  FaKey,
  FaLocationDot,
  FaMars,
  FaPhone,
  FaSuitcaseMedical,
  FaUserDoctor,
  FaVenus,
  FaXmark,
} from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import moment from "moment";

export default function Profile(props: any) {
  function showDni() {
    let dni = props.user.dni;

    dni = dni
      .split("")
      .map((l: string, i: number) => {
        if (i === 2 || i === 5) {
          return "." + l;
        }

        return l;
      })
      .join("");

    return dni;
  }

  return (
    <Layout auth={props.auth}>
      <section className="bg-white w-3/4 mt-24 mx-auto">
        <div className="flex justify-center relative">
          <Avatar
            labelProps={{ className: "hidden" }}
            name={props.user.name}
            surname={props.user.surname}
            className="absolute bg-primary -top-[4.5rem] mx-[10%] md:mx-[5%] xl:mx-[3%] "
            size={130}
            icon={<FaUserDoctor size={60} />}
            photo={
              props.user.image
                ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.user.image}`
                : undefined
            }
          />
          <div className="mt-16">
            <h2
              className={`text-primary text-center ${robotoBold.className} text-3xl`}
            >
              {props.user.name} {props.user.surname}
            </h2>
          </div>
        </div>
        <div
          className="bg-emerald-200 w-3/4 mt-1 mx-auto"
          style={{ height: "1px" }}
        ></div>
        <div className="md:flex md:justify-center">
          <div className="md:w-1/2">
            <h2 className="text-primary text-xl text-center mt-2">
              Datos personales
            </h2>
            <div className="flex flex-col items-center p-2">
              <div className="flex items-center">
                <FaEnvelope className="text-primary" />
                <p className="px-2">{props.user.email}</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-primary" />
                <p className="px-2">{props.user.phone}</p>
              </div>
              <div className="flex items-center">
                <FaAddressCard className="text-primary" />
                <p className="px-2">{showDni()}</p>
              </div>
              <div className="flex items-center">
                <FaCalendarDays className="text-primary" />
                <p className="px-2">
                  {moment().diff(props.user.birthday, "years")} años
                </p>
              </div>
              <div className="flex items-center">
                {props.user.gender ? (
                  <FaMars className="text-primary" />
                ) : (
                  <FaVenus className="text-primary" />
                )}

                <p className="px-2">{props.user.gender ? "Hombre" : "Mujer"}</p>
              </div>
              <div className="flex items-center">
                <FaSuitcaseMedical className="text-primary" />
                <p className="px-2">{props.user.healthInsurance.name}</p>{" "}
                {props.user.validateHealthInsurance ? (
                  <FaCheck className="text-xl text-green-600" />
                ) : (
                  <FaXmark className="text-xl text-red-600" />
                )}
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-primary text-xl text-center mt-2">Seguridad</h2>
            <div className="flex justify-center items-center p-2">
              <FaKey className="text-primary mr-2" />
              <div className="border border-gray-200 w-1/2 md:px-2">
                <p className="text-center">**********</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let user = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${auth?.dni}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    user = user.data;

    return {
      props: {
        user,
        auth,
      },
    };
  },
  true
);
