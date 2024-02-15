import axios from "axios";
import { NextPageContext } from "next";
import { Auth } from "../../shared/types";

const url = process.env.NEXT_PUBLIC_API_URL;

interface withAuthOptions {
  protected: boolean,
  role?: 'user' | 'doctor' | 'admin',
};

const RolesValues = {
  user: 1,
  doctor: 2,
  admin: 3,
};

export default function withAuth(
  cb: null | ((auth: Auth | null, context: NextPageContext) => {}),
  options: withAuthOptions,
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
      const userRole = (session.role ?? "user") as keyof typeof RolesValues; 

      if(options.protected && RolesValues[userRole] < RolesValues[options.role ?? "user"]) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      };

      if (cb) return cb(session, context);

      return {
        props: {
          auth: session,
        },
      };

    } catch (err) {
      if (options.protected) {
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
