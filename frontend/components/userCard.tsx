import { useTheme } from "@mui/material";
import React, { useEffect } from "react";
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
import "moment/locale/es";
import Button from "./button";
import Link from "next/link";
import { showDni } from "@/lib/dni";

const UserCard: React.FC<MeetingResponseDto> = (props) => {
  const theme = useTheme();

  useEffect(() => {
    moment.locale("es");
  }, []);

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
          className={`${robotoBold.className} text-2xl text-primary text-center my-2`}
        >
          {props.user.name} {props.user.surname}
        </h2>
        <div className="w-3/4 h-2 border-t-2 border-emerald-200"></div>
        <div className="flex flex-col items-center my-2">
          <div className="flex items-center">
            <FaAddressCard className="text-primary" />
            <p className="px-2">{showDni(props.user.dni)}</p>
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

            <p className="px-2">{props.user.gender ? "Masculino" : "Femenino"}</p>
          </div>
        </div>
        <div className="w-3/4 h-2 border-b-2 border-emerald-200"></div>
        <Link href={`/meetings/medical-record/${props.user.id}`}>
          <Button className="w-full m-4">Historia clínica</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
