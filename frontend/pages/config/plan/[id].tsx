import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { robotoBold } from "@/lib/fonts";
import Message from "@/components/message";
import { Link } from "@mui/material";

export default function PlanId(props: any) {
  const router = useRouter();
  const [mp, setMP] = useState<any>();
  const [success, setSuccess] = useState<boolean>(false);
  const [id, setId] = useState<any>();

  useEffect(() => {
    const { id } = router.query;
    setId(id);

    const initMP = async () => {
      const MP = await import("@mercadopago/sdk-react");
      setMP(MP);
      return MP;
    };

    initMP().then((res) => {
      res.initMercadoPago("TEST-42764678-3204-404e-8181-56af419d0dcc", { locale: 'es-AR' });
    });
  }, []);

  useEffect(() => {
    async function redirectToConfig() {
      // Una vez que el pago se efectuó
      if (success) {
        // Esperar 5 segundos para redirigir a config
        await new Promise((res) => setTimeout(() => res(1), 5000));
        router.push("/config");
      }
    };

    redirectToConfig();
    // Si se efectuó el pago de forma exitosa
  }, [success])

  return (
    <Layout auth={props.auth}>
      <div className="p-10">
        <div className={`bg-white p-4 shadow-md rounded-md ${success ? 'pb-10' : ''}`}>
          <h2 className={`text-primary text-2xl mb-4 ${robotoBold.className} ${success ? 'mb-10' : ''}`}>Adquirir plan de trabajo - {props.plan.name}</h2>
          {mp?.CardPayment && !success ? (
            <mp.CardPayment
              initialization={{ amount: 2000 }}
              onSubmit={async (data: any) => {
                /* const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/plan/subscribe/${id}`,
                  { cardToken: data.token },
                  {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${props.auth.token}` },
                    }
                    ); */

                await axios.patch(
                  `${process.env.NEXT_PUBLIC_API_URL}/doctor/${props.auth.id}`,
                  { planId: id, userId: props.auth.id },
                  {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${props.auth.token}` },
                  }
                );

                setSuccess(true);

              }}
            />
          ) : <Message message={<p>Serás redirigido automáticamente a la <Link href={"/config"}>configuración</Link></p>} title="Plan adquirido con éxito" />}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {

    if (!context.query.id) return {
      redirect: {
        destination: "/config",
        permanent: false,
      },
    };

    let plan = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan/${context.query.id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${context.req.cookies.token}` },
    });

    plan = plan.data;

    return {
      props: {
        auth,
        plan,
      },
    };
  },
  { protected: true, roles: ['doctor'] }
);
