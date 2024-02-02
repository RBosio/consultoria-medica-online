import axios from "axios";
import { NextPageContext } from "next";
import { Auth } from "../../shared/types";

const url = process.env.NEXT_PUBLIC_API_URL;

export default function withAuth(
  cb: null | ((auth: Auth | null, context: NextPageContext) => {}),
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

      const session = {token: context.req.cookies["token"],...loginRequest.data};

      if (cb) return cb(session, context);

      return {
        props: {
          auth: session,
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

      if (cb) return cb(null, context);

      return { props: { auth: null } };
    }
  };
}
