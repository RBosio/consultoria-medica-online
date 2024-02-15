import React from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";

export default function Home(props: any) {

  return (
    <Layout auth={props.auth}>
      <section>
        Dashboard
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    return {
      props: {
        auth,
      },
    };
  }, { protected: true }
);
