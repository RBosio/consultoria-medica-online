import React, { useState, useEffect } from "react";
import { Auth } from "../../shared/types";
import withAuth from "@/lib/withAuth";
import Layout from "@/components/layout";
import { roboto } from "@/lib/fonts";

export default function RegisterDoctor(props: any) {

    return (
        <Layout auth={props.auth}>
            <section className={``}>

            </section>
        </Layout>
    );
}

export const getServerSideProps = withAuth(
    async (auth: Auth | null, context: any) => {

        if (auth?.role !== 'user') {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        };

        return {
            props: {
                auth,
            },
        };
    },
    { protected: true }
);
