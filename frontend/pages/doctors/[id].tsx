import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import React from "react";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Avatar from "@/components/avatar";
import { FaUserDoctor } from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import { Chip, Divider } from "@mui/material";
import Rate from "@/components/rate";
import { useTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { FaPhone, FaSuitcaseMedical, FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

export default function Doctor(props: any) {

    const theme = useTheme();

    return (
        <Layout auth={props.auth}>
            <section className="h-full flex p-8 overflow-hidden">
                <div className="w-full flex flex-col xl:flex-row gap-6 mt-[3rem]">
                    <div className="w-full rounded-md md:w-[calc(100%-15rem)] xl:shadow-md xl:bg-white xl:min-w-64 xl:w-5/12 relative">
                        {<Avatar
                            labelProps={{ className: "hidden" }}
                            name={props.doctor.user.name}
                            surname={props.doctor.user.surname}
                            className="absolute top-[-4rem] left-1/2 translate-x-[-50%]"
                            size={130}
                            icon={<FaUserDoctor size={60} />}
                            photo={props.doctor.user.image ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.doctor.user.image}` : undefined} />}
                        <div className="mt-20">
                            <div className="flex flex-col items-center gap-3">
                                <h2 className={`text-primary text-center ${robotoBold.className} text-3xl`}>{props.doctor.user.name} {props.doctor.user.surname}</h2>
                                <div className="flex gap-2">
                                    {props.doctor.specialities.map((spec: any) => <Chip key={spec.id} size='small' variant='outlined' color='primary' label={spec.name} />)}
                                </div>
                                <Rate rate={Number(props.doctor.avgRate)} />
                                <Divider variant="middle" sx={{
                                    "&": {
                                        width: "70%",
                                    },
                                    "&::before, &::after": {
                                        borderTop: `thin solid ${theme.palette.primary.main}`,
                                    }
                                }}>
                                    <GoDotFill color={theme.palette.primary.main} />
                                </Divider>

                                <div className="w-full p-4 flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-bold text-lg text-white bg-primary rounded-sm p-2">Descripción</h2>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, vel quam. Quam exercitationem nesciunt reprehenderit aliquam? Magnam, voluptates, quia accusantium tempora quae fuga minus eaque aut rem iste consequuntur asperiores? Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde eum laboriosam esse, expedita facilis voluptate placeat quidem consequatur voluptas rerum deserunt aut libero cum eos non neque suscipit necessitatibus animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam laborum sit ipsa iure debitis nostrum minima nisi.</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-bold text-lg text-white bg-primary rounded-sm p-2">Datos de Contacto</h2>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <IoMdMail size={15} />
                                                <p className="text-secondary">mail@gmail.com</p>
                                            </div>
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <FaPhone size={15} />
                                                <p className="text-secondary">341670803</p>
                                            </div>
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <FaSuitcaseMedical size={15} />
                                                <p className="text-secondary">OSDE</p>
                                            </div>
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <FaLocationDot size={15} />
                                                <p className="text-secondary">St.Exupery 200</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md grow flex justify-center">

                    </div>
                </div>

            </section>
        </Layout >
    );
};

export const getServerSideProps = withAuth(async (auth: Auth | null, context: any) => {

    let { query } = context;

    try {
        let doctor = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${query.id}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${context.req.cookies.token}` }
            });

        doctor = doctor.data;

        let doctorAvailability = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedule/doctor/${query.id}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${context.req.cookies.token}` }
            });

        doctorAvailability = doctorAvailability.data;


        return {
            props: {
                doctor,
                doctorAvailability,
                auth,
            }
        }
    }

    catch {
        return {
            props: {
                auth
            }
        }
    };


}, true)