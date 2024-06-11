import React from "react";
import { useEffect } from "react";
import Chart, { ChartTypeRegistry } from "chart.js/auto";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import axios from "axios";
import SidebarAdmin from "@/components/sidebarAdmin";

interface Speciality {
  speciality: string;
  count: number;
}

interface Meeting {
  year: number;
  value: number;
}

interface MeetingCount {
  year: number;
  count: number;
}

export default function Admin(props: any) {
  useEffect(() => {
    (async function () {
      const specialities = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/charts`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      const canvas = document.getElementById(
        "acquisitions"
      ) as HTMLCanvasElement;
      const canvas2 = document.getElementById(
        "acquisitions2"
      ) as HTMLCanvasElement;
      const canvas3 = document.getElementById(
        "acquisitions3"
      ) as HTMLCanvasElement;
      genCanvas(
        canvas3,
        "pie",
        specialities.data[0],
        "Especialidades con más reuniones"
      );
      genCanvas(
        canvas,
        "bar",
        specialities.data[1],
        "Cantidad de reuniones por año"
      );
      genCanvas(
        canvas2,
        "line",
        specialities.data[2],
        "Dinero acumulado por año"
      );
    })();
  }, []);

  const genCanvas = (
    canvas: HTMLCanvasElement,
    type: keyof ChartTypeRegistry,
    data: { x: number; y: number }[],
    label: string
  ) => {
    new Chart(canvas, {
      type,
      data: {
        labels: data.map((row) => row.x),
        datasets: [
          {
            label,
            data: data.map((row) => row.y),
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex flex-col xl:flex-row justify-center gap-4 w-[90%] mt-12 mx-auto">
        <div>
          <SidebarAdmin
            auth={props.auth}
            setSidebarOpened={true}
            sidebarOpened
          />
        </div>
        <div className="bg-white w-full">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 w-1/2 mx-auto">
            <canvas id="acquisitions"></canvas>
            <canvas id="acquisitions2"></canvas>
          </div>
          <div className="flex items-center justify-center gap-4 p-4 w-1/2 mx-auto">
            <canvas id="acquisitions3"></canvas>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    if (auth!.role !== "admin") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        auth,
      },
    };
  },
  { protected: true }
);
