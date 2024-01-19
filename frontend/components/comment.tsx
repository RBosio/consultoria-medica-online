import { useTheme } from "@mui/material";
import React from "react";
import { robotoBold } from "@/lib/fonts";
import {
  FaUserDoctor,
} from "react-icons/fa6";
import { CommentResponseDto } from "./dto/comment.dto";
import moment from "moment";

const Comment: React.FC<CommentResponseDto> = (props) => {
  const theme = useTheme();

  return (
    <>
      <div className="px-4 py-2">
        <div
          className={`flex flex-col ${
            props.user.id === props.auth.id ? "items-end" : "items-start"
          }`}
        >
          <div className="flex justify-center items-center">
            <div className="rounded-full bg-primary p-1">
              <FaUserDoctor className="text-white text-xl" />
            </div>
            <h4 className={`text-lg text-primary ${robotoBold.className} ml-2`}>
              {`${props.user.name} ${props.user.surname}`}
            </h4>
          </div>
          {props.comment ? (
            <p className="text-justify line-clamp-3 mt-2">{props.comment}</p>
          ) : (
            <p className="text-justify line-clamp-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi,
              minima consequuntur. Harum praesentium dolorum molestias ipsam et
              asperiores porro quam, dicta tempora. Assumenda incidunt sit
              dolore accusantium, facilis sint quas!
            </p>
          )}
        </div>
        <div className="text-gray-500 text-xs mt-2 flex justify-end">
          {moment(props.datetime).format("LLL")}
        </div>
        <div className="bg-primary w-full mt-1" style={{ height: "1px" }}></div>
      </div>
    </>
  );
};

export default Comment;
