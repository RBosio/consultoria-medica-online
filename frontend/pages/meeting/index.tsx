import withAuth from "@/lib/withAuth";
import { Auth } from "@/../shared/types";
import Layout from "@/components/layout";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaCamera, FaMicrophone, FaVideo, FaXmark } from "react-icons/fa6";

export default function Meeting(props: any) {
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    return async () => {
      // const ZoomVideo = await (await import("@zoom/videosdk")).default;
      
      return;
    };
  }, []);

  return (
    <Layout auth={props.auth}>
      <div className="flex h-full">
        <div className="w-3/4 m-4">
          <div className="w-1/3 mx-auto mb-2">
            <div className="relative">
              <canvas
                id="participant-videos-canvas"
                className="w-[320px] h-[180px] bg-gray-800"
                style={{ width: "100%", height: "auto" }}
              ></canvas>
              <p className="absolute bottom-0 right-0 text-white mr-2">
                Name Surname (You)
              </p>
            </div>
          </div>
          <div className="relative">
            <canvas
              id="participant-videos-canvas"
              className="w-[768px] h-[432px] bg-gray-600"
              style={{ width: "100%", height: "auto" }}
            ></canvas>
            <p className="absolute bottom-0 right-0 text-white mr-2">
              Name Surname
            </p>
          </div>
          <div className="w-full h-auto flex justify-center p-2 gap-6">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex justify-center items-center hover:opacity-70 hover:cursor-pointer">
              <FaMicrophone className="text-xl" />
            </div>
            <div className="w-10 h-10 bg-primary text-white rounded-full flex justify-center items-center hover:opacity-70 hover:cursor-pointer">
              <FaVideo className="text-xl" />
            </div>
            <div className="w-10 h-10 bg-red-600 text-white rounded-full flex justify-center items-center hover:opacity-70 hover:cursor-pointer">
              <FaXmark className="text-xl" />
            </div>
          </div>
        </div>
        <div className="w-1/4 h-[calc(100%-30px)] my-4 mr-4 bg-white rounded-lg">
          <div></div>
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
  true
);
