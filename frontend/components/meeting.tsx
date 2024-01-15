import { Chip, Divider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import Rate from "./rate";
import { robotoBold } from "@/lib/fonts";
import Button from "./button";
import { DoctorProps } from "./doctor";
import {
  FaCalendar,
  FaCalendarDays,
  FaCircleInfo,
  FaUserDoctor,
} from "react-icons/fa6";
import { MeetingResponseDto } from "./dto/meeting.dto";
import { GoDotFill } from "react-icons/go";
import moment from "moment";
import Link from "next/link";

const Meeting: React.FC<MeetingResponseDto> = (props) => {
  const onConsultClick = () => {};
  const theme = useTheme();

  moment.locale("es");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    moment.locale("es");
    setStartDate(moment(props.startDatetime).format("L"));
    setStartTime(moment(props.startDatetime).format("LT"));
  }, []);

  return (
    <div className="bg-white rounded-md shadow-md h-auto flex flex-col m-4 relative overflow-hidden" style={{minWidth: 'calc(25% - 32px)'}}>
      {props.doctor.user.photo ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.doctor.user.photo}`}
          alt="Profile photo"
          className="h-64 sm:h-56 object-cover w-full"
        />
      ) : (
        <div className="w-full bg-primary flex items-center justify-center p-6">
          <FaUserDoctor color="#ffffff" size={80} />
        </div>
      )}
      <div className="w-full flex flex-col justify-center items-center">
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
        {/* <Divider
          sx={{
            "&": {
              margin: "1.5rem 0",
            },
            "&::before,&::after": {
              borderTop: `thin solid ${theme.palette.primary.main}`,
            },
          }}
          >
          <GoDotFill color={theme.palette.primary.main} />
        </Divider> */}
        <div className="bg-emerald-600 text-white flex items-center p-1 rounded-lg">
          <FaCalendarDays />
          <p className="ml-2">
            {startDate} - {startTime}
          </p>
        </div>
        <Link href={`${props.user.id}/${props.startDatetime.toString().split('T')[0]}T${props.startDatetime.toString().split('T')[1].split('.')[0]}`}>
          <Button
            onClick={onConsultClick}
            size="medium"
            startIcon={<FaCircleInfo />}
            className="mt-10 mb-6"
          >
            DETALLES
          </Button>
        </Link>
      </div>
      <div className="w-6 h-6 bg-red-700 rounded-full absolute -bottom-2 -right-2">

      </div>
    </div>
  );
};

export default Meeting;
