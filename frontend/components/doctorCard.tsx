import { Chip, useTheme } from "@mui/material";
import React from "react";
import { robotoBold } from "@/lib/fonts";
import {
  FaUserDoctor,
} from "react-icons/fa6";
import { MeetingResponseDto } from "./dto/meeting.dto";
import Rate from "./rate";

const DoctorCard: React.FC<MeetingResponseDto> = (props) => {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-md h-full flex flex-col relative w-full">
      <div className="relative">
        {props.doctor.user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/images/${props.doctor.user.image}`}
            alt="Profile photo"
            className="min-h-96 sm:h-56 object-cover object-center w-full"
          />
        ) : (
          <>
            <div className="w-full bg-primary flex items-center justify-center p-6 rounded-md">
              <FaUserDoctor color="#ffffff" size={80} />
            </div>
            <div className="bg-primary w-full h-2 absolute bottom-0"></div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col justify-start items-center h-full">
        <h2
          className={`${robotoBold.className} text-lg sm:text-2xl text-primary text-center mt-2`}
        >
          {props.doctor.user.name} {props.doctor.user.surname}
        </h2>
        <div className="flex mb-2">
          {props.doctor.specialities.map((s) => {
            return (
              <Chip
                className="my-1 sm:mt-2"
                key={s.id}
                size="small"
                variant="outlined"
                color="primary"
                label={s.name}
              />
            );
          })}
        </div>
        <div className="w-3/4 h-2 border-t-2 border-emerald-200"></div>
        <Rate rate={props.doctor.avgRate} />
        {props.doctor.description ? (
          <p className="text-sm sm:text-base m-4 text-justify line-clamp-6 sm:line-clamp-5">
            {props.doctor.description}
          </p>
        ) : (
          <div className="h-full flex items-center text-center">
            El profesional no posee descripción actualmente
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
