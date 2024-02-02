import withAuth from "@/lib/withAuth";
import React from "react";
import { Auth } from "../../shared/types";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout: React.FC<any> = ({ auth, token }) => {

    const router = useRouter();

    useEffect(() => {
        async function logout() {

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${auth.token}` }
            });

            router.reload();

        };

        logout();
    }, []);

    return (
        <span>
            Logout...
        </span>
    );
};

export const getServerSideProps = withAuth(async (auth: Auth | null, context: any) => {

    return {
        props: {
            auth,
        },
    };

}, true)

export default Logout;