import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, Snackbar } from "@mui/material";

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
      res.initMercadoPago("TEST-42764678-3204-404e-8181-56af419d0dcc");
    });
  }, []);

  return (
    <Layout auth={props.auth}>
      <div className="w-2/3 mx-auto mt-12">
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
              router.push("/");
            }}
          />
        )}
        <Snackbar
          open={success}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={4000}
          onClose={() => {
            setSuccess(false);
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
    let plans = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${context.req.cookies.token}` },
    });

    plans = plans.data;

    return {
      props: {
        auth,
        plans,
      },
    };
  },
  { protected: true }
);
