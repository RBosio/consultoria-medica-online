import { Chip, useTheme } from "@mui/material";
import React from "react";
import { robotoBold } from "@/lib/fonts";
import {
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaSuitcaseMedical,
  FaUserDoctor,
} from "react-icons/fa6";
import { MeetingResponseDto } from "./dto/meeting.dto";
import Rate from "./rate";

const DoctorCard: React.FC<MeetingResponseDto> = (props) => {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-md h-full flex flex-col relative w-full">
      <div className="relative">
        {props.doctor.user.photo ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.doctor.user.photo}`}
            alt="Profile photo"
            className="h-64 sm:h-56 object-cover w-full"
          />
        ) : (
          <div className="w-full bg-primary flex items-center justify-center p-6 rounded-md">
            <FaUserDoctor color="#ffffff" size={80} />
          </div>
        )}
        <div className="bg-primary w-full h-2 absolute bottom-0"></div>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <h2
          className={`${robotoBold.className} text-2xl text-primary text-center mt-2`}
        >
          {props.doctor.user.name} {props.doctor.user.surname}
        </h2>
        <div className="flex mb-2">
          {props.doctor.specialities.map((s) => {
            return (
              <Chip
                className="mx-1"
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
        <Rate rate={props.doctor.avgRate} num={"n"} />
        {props.doctor.description ? (
          <p className="mx-6 mt-2 mb-6 text-justify line-clamp-5">
            {props.doctor.description}
          </p>
        ) : (
          ""
        )}
        <div className="flex flex-col items-center mb-2 mt-2">
          <div className="flex items-center">
            <FaEnvelope className="text-primary" />
            <p className="px-2">{props.doctor.user.email}</p>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-primary" />
            <p className="px-2">{props.doctor.user.phone}</p>
          </div>
          <div className="flex items-center">
            <FaSuitcaseMedical className="text-primary" />
            {props.doctor.user.healthInsurances.map((h, idx) => {
              return (
                <div className="flex">
                  <p key={idx} className="mx-2">{h.name}</p>
                  <p>
                    {idx < props.doctor.user.healthInsurances.length - 1
                      ? "|"
                      : ""}
                  </p>
                </div>
              );
            })}
          </div>
          {props.doctor.address ? (
            <div className="flex items-center">
              <FaLocationDot className="text-primary" />
              <p className="px-2">{props.doctor.address}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
