import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, Snackbar } from "@mui/material";
import { robotoBold } from "@/lib/fonts";

export default function Login(props: any) {
  const router = useRouter();
  const [mp, setMP] = useState<any>();
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
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

  return (
    <Layout auth={props.auth}>
      <div className="p-10">
        <h2 className={`text-primary text-2xl mb-4 ${robotoBold.className}`}>Adquirir plan de trabajo - {props.plan.name}</h2>
        {mp?.CardPayment && (
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
              setMessage("Plan adquirido con éxito");
            }}
          />
        )}
        <Snackbar
          open={success}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
          onClose={() => {
            setSuccess(false);
            if(success) router.push("/")
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={success ? "success" : "error"}
          >
            {message}
          </Alert>
        </Snackbar>
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
  { protected: true }
);
