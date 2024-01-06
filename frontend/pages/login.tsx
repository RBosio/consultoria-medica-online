import Layout from "@/components/layout";
import { Formik } from "formik";
import Input from "@/components/input";
import Button from "@/components/button";
import { robotoBold } from '@/utils/fonts';
import Image from "next/image";
import Link from "next/link";

export default function Login() {

    return (
        <Layout>
            <section className="h-full flex">
                <div className="h-full grow flex flex-col items-center justify-center">
                    <Image src="/logo.png" width={300} height={300} alt="Logo HealthTech" />
                    <div className="px-12 w-full sm:px-0 sm:w-[25rem] md:w-[30rem]">
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
                                <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>
                                    <Input label="E-Mail" />
                                    <Input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        label="Contraseña"
                                    />
                                    <Button className="mt-6 mb-4">
                                        Acceder
                                    </Button>
                                </form>
                            )}
                        </Formik>
                        <p className="text-center text-black">¿Olvidaste tu contraseña?
                            <Link className={`font-bold cursor-pointer text-primary  hover:underline mx-1`} href="#">
                                Recupérala aquí
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden sm:block sm:bg-primary sm:w-4/12 md:w-5/12 h-full relative overflow-hidden">
                    <video className="h-full object-cover" autoPlay muted loop id="video-background">
                        <source src={`/${Math.floor(Math.random() * 4) + 1}.mp4`} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                    </video>
                    <div className="flex justify-center bg-gradient-to-b from-emerald-900 to-black opacity-85 absolute top-0 right-0 h-full w-full">
                    </div>


                </div>

            </section>
        </Layout>
    );

};
