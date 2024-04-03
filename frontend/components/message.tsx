import React from "react";
import Button from "./button";
import { useRouter } from "next/router";
import { CiCircleAlert, CiCircleCheck } from "react-icons/ci";

export interface MessageProps {
  title: string;
  message: any;
  buttonText: string;
  error?: boolean;
  handleClick: any;
}

const Message: React.FC<MessageProps> = (props) => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex justify-center items-center bg-white">
      <div className="w-11/12 sm:w-9/12 lg:w-6/12 shadow-lg">
        <div
          className={`${
            props.error ? "bg-red-600" : "bg-primary"
          } w-full flex justify-center p-2`}
        >
          {props.error ? (
            <CiCircleAlert color="#ffffff" size={100} />
          ) : (
            <CiCircleCheck color="#ffffff" size={100} />
          )}
        </div>
        <div className="flex justify-center flex-col items-center p-6 gap-4 text-center">
          <h2
            className={`${
              props.error ? "text-red-600" : "text-primary"
            } text-3xl font-semibold text-center`}
          >
            {props.title}
          </h2>
          <h3 className="text-lg">{props.message}</h3>
          <Button onClick={props.handleClick}>{props.buttonText}</Button>
        </div>
      </div>
    </div>
  );
};

export default Message;
