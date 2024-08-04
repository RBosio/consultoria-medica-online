import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../types";
import axios from "axios";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { Chip, Divider, useTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { pesos } from "@/lib/formatCurrency";
import { roboto, robotoBold } from "@/lib/fonts";
import { FaExclamationCircle } from "react-icons/fa";
import { DoctorResponseDto } from "@/components/dto/doctor.dto";
import moment from "moment";

export default function Plan(props: any) {

    const theme = useTheme();
    const router = useRouter();

    const planExpiration = () => {
        if (!(props.auth.role === "doctor") || !props.doctor.plan) return;
        const lastPayment = moment(props.doctor.planLastPayment);
        const planExpiration = lastPayment.add(1, 'months');
    
        const diff = moment().diff(planExpiration, 'days');
    
        // Si luego de un mes del último pago, pasaron más de N días, entonces el plan expirará cuando N = 5, o sea, pasaron 5 días luego
        // de que haya pasado un mes del último pago
        if (diff >= 0) return planExpiration.add(5, 'days');
    
      };

    return (
        <Layout auth={props.auth}>
            <section className="p-0 lg:p-10 md:h-full">
                <div className="bg-white w-full rounded-md shadow-md h-full p-4">
                    <div className="w-full">
                        <h2 className={`${robotoBold.className} text-primary text-2xl`}>Adquirir plan de trabajo</h2>
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col my-10 items-center">
                                <p className={`flex items-center text-primary gap-2 text-2xl text-center ${roboto.className}`}><FaExclamationCircle size={30} />¿Deseas tener más visibilidad en la plataforma?</p>
                                <p className={`${robotoBold.className} text-primary text-3xl text-center`}>Actualiza tu plan ahora mismo</p>
                            </div>
                            <div className="flex flex-col w-full gap-10 md:gap-4 md:flex-row md:w-auto">
                                {props.plans.map((p: PlanResponseDto) => (
                                    <div
                                        key={p.id}
                                        className={`bg-white flex flex-col border-2 border-gray-200 items-center shadow-md rounded-md ${p.id === 3 ? 'gold-glow' : ''}`}
                                    >
                                        <h2 className="text-3xl text-primary font-semibold text-center pt-4">
                                            {p.name}
                                        </h2>
                                        <Divider
                                            variant="middle"
                                            sx={{
                                                "&": {
                                                    width: "70%",
                                                },
                                                "&::before, &::after": {
                                                    borderTop: `thin solid ${theme.palette.primary.main}`,
                                                },
                                            }}
                                        >
                                            <GoDotFill color={theme.palette.primary.main} />
                                        </Divider>
                                        <ul className="my-4 p-4 min-h-28">
                                            {p.benefits.map((b: BenefitResponseDto) => (
                                                <li key={b.id} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-primary rounded-md"></div>
                                                    {b.name}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="my-4 w-full flex justify-center">
                                            {p.id === props.doctor.plan?.id ?
                                                planExpiration() ?
                                                    <Button
                                                        onClick={() => router.push("/config/plan/" + p.id)}
                                                    >
                                                        Renovar plan
                                                    </Button> :
                                                    <Chip
                                                        className="h-9 w-full max-w-36 select-none"
                                                        size="medium"
                                                        variant="filled"
                                                        color="warning"
                                                        label={'Plan actual'}
                                                    /> : <Button
                                                        onClick={() => router.push("/config/plan/" + p.id)}
                                                    >
                                                    Actualizar plan
                                                </Button>}
                                        </div>
                                        <h4 className="px-12 py-4 text-white text-center font-extrabold text-xl bg-primary w-full h-full">
                                            {pesos.format(p.price)} / mes
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export const getServerSideProps = withAuth(
    async (auth: Auth | null, context: any) => {

        let doctor = await axios.get<DoctorResponseDto>(
            `${process.env.NEXT_PUBLIC_API_URL}/doctor/user/${auth?.id}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${context.req.cookies.token}` },
            }
        );

        let plans = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${auth?.token}` },
        });

        plans = plans.data;

        return {
            props: {
                doctor: doctor.data,
                auth,
                plans,
            },
        };
    },
    { protected: true, roles: ['doctor'] }
);
