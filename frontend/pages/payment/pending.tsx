import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { useRouter } from "next/router";
import { Auth } from "../../../shared/types";

export default function Pending(props: any) {
  const router = useRouter();
  return (
    <Layout auth={props.auth} renderNavbar={false} renderSidebar={false}>
      <p>pending!</p>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null) => {
    return {
      props: {
        auth,
      },
    };
  },
  { protected: false }
);
