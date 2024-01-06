import Layout from "@/components/layout";
import { Formik } from "formik";
import Input from "@/components/input";
import Button from "@/components/button";
import { roboto, robotoSemiBold, robotoBold } from '@/lib/fonts';
import { useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { Divider } from "@mui/material";

export default function Login(props: any) {

    const theme = useTheme();

    return (
        <Layout>
            <section className="h-full flex">
                <div className="h-full grow flex flex-col items-center justify-center">
                    <Image src="/logo.png" width={300} height={300} alt="Logo HealthTech" />
                    <div className="px-12 w-full sm:px-0 sm:w-[25rem] lg:w-[30rem]">
                        <h2 className={`text-center mb-6 mt-12 text-primary font-bold text-2xl ${robotoBold.className} uppercase`}>Ingresar</h2>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validate={values => {
                                const errors = { email: "" };
                                if (!values.email) {
                                    errors.email = 'Required';
                                } else if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                ) {
                                    errors.email = 'Invalid email address';
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    alert(JSON.stringify(values, null, 2));
                                    setSubmitting(false);
                                }, 400);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <form method="post" action={"/login"} className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
                                    <Input label="E-Mail" />
                                    <Input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        label="Contraseña"
                                    />
                                    <Link className={`cursor-pointer text-right text-base text-secondary hover:underline`} href="#">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                    <Button type="submit">
                                        Acceder
                                    </Button>
                                </form>
                            )}
                        </Formik>
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
        </Layout>
    );

};

export async function getServerSideProps() {

    return {
        props: {
            //Por el momento genera números del 1 al 4 porque en la carpeta public hay solo 4 videos
            chosenVideo: Math.floor(Math.random() * 4) + 1,
        },
    };
}

