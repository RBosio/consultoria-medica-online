import React, { useEffect } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import { UserResponseDto } from "@/components/dto/user.dto";



export default function Home(props: any) {
  return (
    <Layout user={props.user} auth={props.auth}>
      <section>
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any, user: UserResponseDto) => {
    return {
      props: {
        auth,
        user
      },
    };
  },
  true
);
