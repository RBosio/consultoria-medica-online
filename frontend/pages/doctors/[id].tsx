import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import React from "react";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Avatar from "@/components/avatar";
import { FaUserDoctor } from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";

export default function Doctor(props: any) {
    console.log(props.doctor)
    return (
        <Layout auth={props.auth}>
            <section className="h-full flex flex-col xl:flex-row overflow-hidden">
                <div className="flex items-center justify-center bg-primary w-full h-44">
                    <div className="flex flex-col items-center gap-2">
                        {
                            props.doctor.user.image ?
                                <Avatar
                                    labelProps={{ className: "hidden" }}
                                    name={props.doctor.user.name}
                                    surname={props.doctor.user.surname}
                                    size={100}
                                    photo={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.doctor.user.image}`} />
                                :
                                <div className="w-[14.5rem] bg-primary flex items-center justify-center">
                                    <FaUserDoctor color="#ffffff" size={80} />
                                </div>
                        }
                        <span className={`text-white ${robotoBold.className} text-2xl`}>{props.doctor.user.name} {props.doctor.user.surname}</span>
                    </div>
                </div>

            </section>
        </Layout>
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