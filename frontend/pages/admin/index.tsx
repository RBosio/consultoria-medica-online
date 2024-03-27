import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";


const Admin:React.FC<any> = () => {
    
    const router = useRouter();

    useEffect(() => {
        // Redirección a Usuarios en Panel de Administración
        router.push("/admin/users")
    },[]);
    
    return(
        <>
        </>
    )
};

export default Admin;