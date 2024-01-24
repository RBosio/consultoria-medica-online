import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import Layout from "@/components/layout";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ZoomVideo from "@zoom/videosdk";

export default function Meeting(props: any) {
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    let client = ZoomVideo.createClient()
  })

  return (
    <Layout auth={props.auth}>
      <main></main>
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
  true
);
