import Layout from "@/components/layout";
import { roboto } from "@/lib/fonts";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import Profile from "@/components/profile";
import axios from "axios";

export default function ProfileView(props: any) {
  return (
    <Layout auth={props.auth}>
      <section className={`flex ${roboto.className}`}>
        <Profile auth={props.auth} healthInsurances={props.healthInsurances} />
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let healthInsurances = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    healthInsurances = healthInsurances.data;
    return {
      props: {
        auth,
        healthInsurances,
      },
    };
  },
  { protected: true }
);
