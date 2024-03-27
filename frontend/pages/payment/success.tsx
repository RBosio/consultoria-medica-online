import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { useRouter } from "next/router";
import { Auth } from "../../../shared/types";
import axios from "axios";
import moment from "moment";

export default function Success(props: any) {
  const router = useRouter();
  return (
    <Layout auth={props.auth} renderNavbar={false} renderSidebar={false}>
      <p>success!</p>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    try {
      let lastPayment = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/lastPayment/${auth?.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      const payment = lastPayment.data;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/pay/${
          payment.userId
        }/${moment(payment.startDatetime).format("YYYY-MM-DDTHH:mm:ss")}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        }
      );

      return {
        props: {
          auth,
        },
      };
    } catch (error) {
      console.error(error);
    }
  },
  { protected: true }
);
