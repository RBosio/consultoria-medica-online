import { useTheme } from "@mui/material";
import React from "react";
import { robotoBold } from "@/lib/fonts";
import {
  FaAddressCard,
  FaCalendarDays,
  FaCircleCheck,
  FaCircleXmark,
  FaEnvelope,
  FaMars,
  FaPhone,
  FaSuitcaseMedical,
  FaUser,
  FaVenus,
} from "react-icons/fa6";
import { MeetingResponseDto } from "./dto/meeting.dto";
import moment from "moment";
import Button from "./button";
import Link from "next/link";

const UserCard: React.FC<MeetingResponseDto> = (props) => {
  const theme = useTheme();

  function showDni() {
    let dni = props.user.dni;

    dni = dni
      .split("")
      .map((l, i) => {
        if (i === 2 || i === 5) {
          return "." + l;
        }

        return l;
      })
      .join("");

    return dni;
  }

  return (
    <div className="bg-white rounded-md h-full flex flex-col relative w-full">
      <div className="relative">
        {props.user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/images/${props.user.image}`}
            alt="Profile photo"
            className="h-64 sm:h-56 object-cover w-full"
          />
        ) : (
          <>
            <div className="w-full bg-primary flex items-center justify-center p-6 rounded-md">
              <FaUser color="#ffffff" size={80} />
            </div>
            <div className="bg-primary w-full h-2 absolute bottom-0"></div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <h2
          className={`${robotoBold.className} text-2xl text-primary text-center mt-2`}
        >
          {props.user.name} {props.user.surname}
        </h2>
        <div className="w-3/4 h-2 border-t-2 border-emerald-200"></div>
        <div className="flex flex-col items-center mb-2 mt-2">
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
            {props.user.healthInsurances.map((h) => {
              return (
                <p
                  className="px-2 flex items-center gap-2"
                  key={h.healthInsurance.id}
                >
                  {h.healthInsurance.name}{" "}
                  {h.verified ? (
                    <FaCircleCheck className="text-green-600 text-xl" />
                  ) : (
                    <FaCircleXmark className="text-red-600 text-xl" />
                  )}
                </p>
              );
            })}
          </div>
        </div>
        <div className="w-3/4 h-2 border-b-2 border-emerald-200"></div>
      </div>
      <div className="h-full flex justify-center items-end my-4">
        <Link href={`/medical-record/${props.user.id}`}>
          <Button className="w-full">Historia clinica</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
