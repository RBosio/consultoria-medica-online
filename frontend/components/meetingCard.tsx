import { Chip } from "@mui/material";
import React, { useEffect } from "react";
import { robotoBold } from "@/lib/fonts";
import Button from "./button";
import {
  FaCalendarDays,
  FaCircleInfo,
  FaUser,
  FaUserDoctor,
} from "react-icons/fa6";
import { MeetingResponseDto } from "./dto/meeting.dto";
import moment from "moment";
import "moment/locale/es";
import Link from "next/link";

const MeetingCard: React.FC<MeetingResponseDto> = (props) => {
  const onConsultClick = () => {};

  useEffect(() => {
    moment.locale("es");
  }, []);

  return (
    <div className="bg-white rounded-md min-w-[calc(50%-32px)] lg:min-w-[calc(25%-32px)] shadow-md h-100 sm:h-auto flex flex-col m-4 relative overflow-hidden">
      {props.auth?.role === "user" ? (
        props.doctor.user.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/images/${props.doctor.user.image}`}
            alt="Profile photo"
            className="min-h-60 max-h-80 sm:h-56 object-cover object-center w-full"
          />
        ) : (
          <div className="min-h-60 w-full bg-primary flex items-center justify-center p-6">
            <FaUserDoctor color="#ffffff" size={80} />
          </div>
        )
      ) : props.user.image ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/images/${props.user.image}`}
          alt="Profile photo"
          className="min-h-60 max-h-80 sm:h-56 object-cover object-center w-full"
        />
      ) : (
        <div className="min-h-60 w-full bg-primary flex items-center justify-center p-6">
          <FaUser color="#ffffff" size={80} />
        </div>
      )}
      <div className="w-full flex flex-col justify-center items-center">
        {props.auth?.role === "user" ? (
          <>
            <h2
              className={`${robotoBold.className} text-lg sm:text-2xl text-primary text-center`}
            >
              {props.doctor.user.name} {props.doctor.user.surname}
            </h2>
            <div className="flex mb-2">
              {props.specialities?.map((s) => {
                return (
                  <Chip
                    className="mt-1 mb-2 text-xs sm:text-sm"
                    key={s.id}
                    size="small"
                    variant="outlined"
                    color="primary"
                    label={s.name}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <h2
            className={`${robotoBold.className} text-lg md:text-xl lg:text-2xl text-primary text-center`}
          >
            {props.user.name} {props.user.surname}
          </h2>
        )}
        <div className="w-3/4 h-2 border-t-2 border-emerald-200 mb-3"></div>
        <div className="border-b border-b-emerald-800 font-normal sm:font-normal text-xs sm:text-base text-white bg-emerald-600 flex items-center py-2 sm:p-1 rounded-lg">
          <FaCalendarDays />
          <p className="ml-1">
            {moment(props.startDatetime).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        </div>
        <div>
          <p className="text-zinc-800 text-base">{props.status}</p>
        </div>
        <Link
          href={`meetings/${btoa(
            props.user.id +
              "." +
              moment(props.startDatetime).format("YYYY-MM-DDTHH:mm:ss")
          )}`}
          className="my-3"
        >
          <Button
            onClick={onConsultClick}
            size="medium"
            startIcon={<FaCircleInfo />}
            className="text-sm sm:text-base"
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
