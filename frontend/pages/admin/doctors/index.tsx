import React from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";

export default function Home(props: any) {
  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center h-full gap-4 w-[90%]">
          <SidebarAdmin
            auth={props.auth}
            setSidebarOpened={true}
            sidebarOpened
          />
          <section className="h-[calc(100%-5rem)] bg-white rounded-md w-full">
            doctors
          </section>
        </div>
      </div>
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
  },
  { protected: true }
);
