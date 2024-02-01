import axios from "axios";
import { NextPageContext } from "next";
import { Auth } from "../../shared/types";
import { UserResponseDto } from "@/components/dto/user.dto";

const url = process.env.NEXT_PUBLIC_API_URL;

export default function withAuth(
  cb: null | ((auth: Auth | null, context: NextPageContext, user: any) => {}),
  protectedRoute: boolean
) {
  return async (context: any) => {
    try {
      const loginRequest = await axios.get(`${url}/auth/session`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${context.req.cookies["token"]}`,
        },
      });

      const user = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${loginRequest.data.dni}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      const t: UserResponseDto = user.data;
      t.token = context.req.cookies.token;

      if (cb) return cb(loginRequest.data, context, t);

      return {
        props: {
          auth: loginRequest.data,
        },
      };
    } catch (err) {
      if (protectedRoute) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      if (cb) return cb(null, context, null);

      return { props: { auth: null } };
    }
  };
}
