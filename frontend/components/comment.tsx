import { useTheme } from "@mui/material";
import React from "react";
import { robotoBold } from "@/lib/fonts";
import { FaUserDoctor } from "react-icons/fa6";
import { CommentResponseDto } from "./dto/comment.dto";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const Comment: React.FC<CommentResponseDto> = (props) => {
  const theme = useTheme();
  const router = useRouter();

  async function handleClick(name: string, type: string) {
    await axios({
      url: `http://localhost:3000/uploads/user/files/${props.files.url}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      if (type.includes("office")) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}`);
        document.body.appendChild(link);
        link.click();
      }
    });
  }

  return (
    <>
      <div className="px-4 py-2">
        <div
          className={`flex flex-col ${
            props.user.id === props.auth.id
              ? "items-end text-right"
              : "items-start text-left"
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
            <p className="line-clamp-3 mt-[2px] w-3/4">{props.comment}</p>
          ) : props.files ? (
            props.files.type.includes("office") ? (
              <p
                key={props.files.url}
                className="text-primary mt-[2px] p-[2px] rounded-sm hover:cursor-pointer hover:opacity-70 underline w-3/4"
                onClick={() => handleClick(props.files.name, props.files.type)}
              >
                {props.files.name}
              </p>
            ) : (
              <Link
                key={props.files.url}
                target="_blank"
                href={`http://localhost:3000/uploads/user/files/${props.files.url}`}
              >
                <p className="text-primary mt-[2px] p-[2px] rounded-sm hover:cursor-pointer hover:opacity-70 underline">
                  {props.files.name}
                </p>
              </Link>
            )
          ) : (
            ""
          )}
          <div className="text-gray-500 text-xs mt-2 flex justify-end">
            {moment(props.datetime).format("LLL")}
          </div>
        </div>
        <div
          className="bg-emerald-200 w-full mt-1"
          style={{ height: "1px" }}
        ></div>
      </div>
    </>
  );
};

export default Comment;
