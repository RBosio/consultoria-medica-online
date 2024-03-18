import Layout from "@/components/layout";
import { useFormik } from "formik";
import Input from "@/components/input";
import Button from "@/components/button";
import { robotoBold } from '@/lib/fonts';
import { useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { Divider } from "@mui/material";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import axios from "axios";
import * as Yup from 'yup';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login(props: any) {

    const router = useRouter();
    const theme = useTheme();
    const [formError, setFormError] = useState(false);
    const loginForm = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Debes ingresar tu e-mail').email('Debes ingresar un mail válido'),
            password: Yup.string().required('Debes ingresar tu contraseña'),

        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let loginReq = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, values, { withCredentials: true });
                loginReq = loginReq.data;
                router.push(`/`);
            }
            catch (error: any) {
                if ([404, 401].includes(error.response.status)) {
                    loginForm.errors.email = "Las credenciales ingresadas no coinciden con ningún usuario";
                    loginForm.values.password = "";
                } else {
                    setFormError(true);
                };
            }
            finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Layout auth={props.auth} renderNavbar={false} renderSidebar={false}>
            <section className="h-full flex">
                <div className="h-full grow flex flex-col items-center justify-center">
                    <Image src="/logo.png" width={300} height={300} alt="Logo HealthTech" />
                    <div className="px-12 w-full sm:px-0 sm:w-[25rem] lg:w-[30rem]">
                        <h2 className={`text-center mb-6 mt-12 text-primary font-bold text-2xl ${robotoBold.className} uppercase`}>Ingresar</h2>
                        <Snackbar open={formError} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={4000} onClose={() => { setFormError(false) }}>
                            <Alert elevation={6} variant="filled" severity="error">Se ha producido un error</Alert>
                        </Snackbar>
                        <form className="flex flex-col gap-y-6" onSubmit={loginForm.handleSubmit}>
                            <Input
                                type="email"
                                name="email"
                                onChange={loginForm.handleChange}
                                onBlur={loginForm.handleBlur}
                                value={loginForm.values.email}
                                label="E-Mail"
                                error={Boolean(loginForm.touched.email && loginForm.errors.email)}
                                helperText={loginForm.errors.email && loginForm.touched.email && loginForm.errors.email}
                            />
                            <Input
                                type="password"
                                name="password"
                                onChange={loginForm.handleChange}
                                onBlur={loginForm.handleBlur}
                                value={loginForm.values.password}
                                label="Contraseña"
                                error={Boolean(loginForm.touched.password && loginForm.errors.password)}
                                helperText={loginForm.errors.password && loginForm.touched.password && loginForm.errors.password}
                            />
                            <Link className={`cursor-pointer text-right text-base text-secondary hover:underline`} href="#">
                                ¿Olvidaste tu contraseña?
                            </Link>
                            <Button disabled={loginForm.isSubmitting} type="submit">
                                Acceder
                            </Button>
                        </form>
                        <Divider sx={{
                            "&": {
                                "margin": "1.5rem 0"
                            },
                            "&::before,&::after": {
                                borderTop: `thin solid ${theme.palette.primary.main}`,
                            }
                        }}>
                            <GoDotFill color={theme.palette.primary.main} />
                        </Divider>
                        <p className="text-center text-black">¿No estás registrado aún?
                            <Link className={`font-bold cursor-pointer text-primary  hover:underline mx-1`} href="#">
                                Crear una cuenta
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden sm:block sm:bg-primary sm:w-4/12 md:w-5/12 h-full relative overflow-hidden">
                    <video className="h-full object-cover" autoPlay muted loop id="video-background">
                        <source src={`/${props.chosenVideo}.mp4`} type="video/mp4" />
                        Not supported video format
                    </video>
                    <div className={`p-5 flex justify-center bg-gradient-to-b from-emerald-900 to-emerald-400 opacity-90 absolute bottom-0 right-0 h-full w-full`}>
                    </div>
                </div>

            </section>
        </Layout >
    );

};

export const getServerSideProps = withAuth(async (auth: Auth | null) => {

    if (auth) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            auth,
            //Por el momento genera números del 1 al 4 porque en la carpeta public hay solo 4 videos
            chosenVideo: Math.floor(Math.random() * 4) + 1,
        },
    };

}, {protected:false})


