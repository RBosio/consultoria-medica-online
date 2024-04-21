import React, { useState, useEffect } from "react";
import { Auth } from "../../shared/types";
import withAuth from "@/lib/withAuth";
import Layout from "@/components/layout";
import { roboto } from "@/lib/fonts";
import Input from "@/components/input";
import { FaPaperclip } from "react-icons/fa6";
import { Alert, IconButton, Snackbar } from "@mui/material";
import Button from "@/components/button";

export default function RegisterDoctor(props: any) {

    const [registrationFile, setRegistrationFile] = useState<any>(null);
    const [titleFile, setTitleFile] = useState<any>(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleTitleChange = ($e: any) => {
        if (
            $e.target.files &&
            $e.target.files[0] &&
            ($e.target.files[0].type.includes("jpg") ||
                $e.target.files[0].type.includes("jpeg") ||
                $e.target.files[0].type.includes("pdf") ||
                $e.target.files[0].type.includes("png"))
        ) {
            setTitleFile($e.target.files[0]);
        } else {
            setError(true);
            setErrorMessage("Debes seleccionar un archivo válido!");
            setTitleFile(null);
        }
    };

    const handleRegistrationChange = ($e: any) => {
        if (
            $e.target.files &&
            $e.target.files[0] &&
            ($e.target.files[0].type.includes("jpg") ||
                $e.target.files[0].type.includes("jpeg") ||
                $e.target.files[0].type.includes("pdf") ||
                $e.target.files[0].type.includes("png"))
        ) {
            setRegistrationFile($e.target.files[0]);
        } else {
            setError(true);
            setErrorMessage("Debes seleccionar un archivo válido!");
            setRegistrationFile(null);
        }
    };

    const handleUploadClick = () => {

    };

    return (
        <Layout auth={props.auth}>
            <section className={`${roboto.className} p-4 flex flex-col`}>
                <h2 className="text-primary font-bold text-2xl mb-6">Solicitar la verificación como profesional médico</h2>
                <Input label="Matrícula"
                    fullWidth
                    variant="outlined"
                    className="mb-5"
                    value={registrationFile ? registrationFile.name : ""}
                    endadornment={
                        <IconButton size="small" onClick={() => { const regIpt = document.getElementById('registration'); regIpt?.click() }}>
                            <FaPaperclip />
                        </IconButton>
                    }>
                </Input>
                <input
                    type="file"
                    id="registration"
                    className="hidden"
                    onChange={handleRegistrationChange}
                />
                <Input label="Título"
                    fullWidth
                    variant="outlined"
                    className="mb-5"
                    value={titleFile ? titleFile.name : ""}
                    endadornment={
                        <IconButton size="small" onClick={() => { const titleIpt = document.getElementById('title'); titleIpt?.click() }}>
                            <FaPaperclip />
                        </IconButton>
                    }>
                </Input>
                <input
                    type="file"
                    id="title"
                    className="hidden"
                    onChange={handleTitleChange}
                />
                <Button onClick={handleUploadClick}>
                    ACEPTAR
                </Button>
                <Snackbar
                    open={error}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={4000}
                    onClose={() => setError(false)}
                >
                    <Alert elevation={6} variant="filled" severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </section>
        </Layout >
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
