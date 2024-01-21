import { Chip, useTheme } from "@mui/material";
import React from "react";
import { robotoBold } from "@/lib/fonts";
import Button from "./button";
import {
  FaCalendar,
  FaCalendarDays,
  FaCircleInfo,
  FaUser,
  FaUserDoctor,
} from "react-icons/fa6";
import { MeetingResponseDto } from "./dto/meeting.dto";
import moment from "moment";
import Link from "next/link";

const MeetingCard: React.FC<MeetingResponseDto> = (props) => {
  const onConsultClick = () => {};
  const theme = useTheme();

  return (
    <div
      className="bg-white rounded-md shadow-md h-auto flex flex-col m-4 relative overflow-hidden"
      style={{ minWidth: "calc(25% - 32px)" }}
    >
      {props.auth?.role === "user" ? (
        props.doctor.user.photo ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.doctor.user.photo}`}
            alt="Profile photo"
            className="h-64 sm:h-56 object-cover w-full"
          />
        ) : (
          <div className="w-full bg-primary flex items-center justify-center p-6">
            <FaUserDoctor color="#ffffff" size={80} />
          </div>
        )
      ) : props.user.photo ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.user.photo}`}
          alt="Profile photo"
          className="h-64 sm:h-56 object-cover w-full"
        />
      ) : (
        <div className="w-full bg-primary flex items-center justify-center p-6">
          <FaUser color="#ffffff" size={80} />
        </div>
      )}
      <div className="w-full flex flex-col justify-center items-center">
        {props.auth?.role === "user" ? (
          <>
            <h2
              className={`${robotoBold.className} text-2xl text-primary text-center`}
            >
              {props.doctor.user.name} {props.doctor.user.surname}
            </h2>
            <Chip
              className="mb-2"
              key={props.speciality.id}
              size="small"
              variant="outlined"
              color="primary"
              label={props.speciality.name}
            />
          </>
        ) : (
          <h2
            className={`${robotoBold.className} text-2xl text-primary text-center`}
          >
            {props.user.name} {props.user.surname}
          </h2>
        )}

        <div className="w-3/4 h-2 border-t-2 border-emerald-200 mb-3"></div>
        <div className="border-b border-b-emerald-800 text-white bg-emerald-600 flex items-center p-1 rounded-lg">
          <FaCalendarDays />
          <p className="ml-1">
            {moment(props.startDatetime).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        </div>
        <div>
          <p className="text-zinc-800">{props.status}</p>
        </div>
        <Link
          href={`${props.user.id}/${moment(props.startDatetime).format(
            "YYYY-MM-DDTHH:mm:ss"
          )}`}
          className="my-6"
        >
          <Button
            onClick={onConsultClick}
            size="medium"
            startIcon={<FaCircleInfo />}
          >
            DETALLES
          </Button>
        </Link>
      </div>
      <div className="w-6 h-6 bg-primary rounded-full absolute -bottom-2 -right-2"></div>
    </div>
  );
};

export default MeetingCard;
