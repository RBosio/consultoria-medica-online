import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Button from "@/components/button";
import { FaCartShopping, FaChevronRight } from "react-icons/fa6";
import { useRouter } from "next/router";

export default function Login(props: any) {
  const router = useRouter()

  return (
    <Layout auth={props.auth}>
      <div className="p-24 mx-12">
        <div className="flex items-center gap-24 flex-wrap">
          {props.plans.map((plan: any) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-md text-center min-w-96"
            >
              <div className="relative">
                <img
                  className="object-cover object-center rounded-t-lg w-96"
                  src={`/assets/medical-billing.jpg`}
                />
                <div className="bg-black absolute w-full h-full top-0 opacity-10"></div>
              </div>
              <div className="mt-2 text-primary text-2xl uppercase font-semibold">
                {plan.name}
              </div>
              <div className="text-lg text-gray-400">$ {plan.price} / mes</div>
              <div className="mt-6 h-48 flex flex-col w-1/2 m-auto">
                <h2 className="text-primary text-xl uppercase">Beneficios</h2>
                {plan.benefits.map((benefit: any) => (
                  <div key={benefit.id} className="flex items-center gap-2">
                    <FaChevronRight className="text-primary" />
                    <p className="text-gray-600 text-left">{benefit.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 mb-4" onClick={() => router.push("plan/"+plan.id)}>
                <Button startIcon={<FaCartShopping />}>Suscribirse</Button>
              </div>
            </div>
          ))}
        </div>
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
