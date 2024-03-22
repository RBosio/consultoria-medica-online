import Layout from "@/components/layout";
import { useFormik } from "formik";
import Input from "@/components/input";
import Button from "@/components/button";
import { robotoBold } from '@/lib/fonts';
import { useTheme } from "@mui/material";
import Image from "next/image";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import axios from "axios";
import * as Yup from 'yup';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "@/components/dateInput";

export default function Register(props: any) {

    const router = useRouter();
    const theme = useTheme();
    const [formError, setFormError] = useState(false);
    const registerForm = useFormik({
        initialValues: {
            name: '',
            surname: '',
            dni: '',
            cuit: '',
            email: '',
            password: '',
            repeat_password: '',
            birthday: '',
            phone: '',
            province: '',
            city: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Debes ingresar tu nombre').min(1, 'El nombre debe tener al menos 1 carácter'),
            surname: Yup.string().required('Debes ingresar tu apellido').min(1, 'El apellido debe tener al menos 1 carácter'),
            dni: Yup.string().required('Debes ingresar tu DNI').matches(/^[0-9]{8}$/, 'El DNI debe tener 8 dígitos'),
            cuit: Yup.string().required('Debes ingresar tu CUIT').matches(/^\d{2}-\d{8}-\d$/, 'El CUIT debe tener el formato xx-xxxxxxxx-x'),
            email: Yup.string().required('Debes ingresar tu e-mail').email('Debes ingresar un mail válido'),
            password: Yup.string().required('Debes ingresar tu contraseña').min(8, 'La contraseña debe tener al menos 8 carácteres'),
            repeat_password: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir').required('Debes confirmar tu contraseña'),

        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let loginReq = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, values, { withCredentials: true });
                loginReq = loginReq.data;
                router.push(`/`);
            }
            catch (error: any) {
                if ([404, 401].includes(error.response.status)) {
                    registerForm.errors.email = "Las credenciales ingresadas no coinciden con ningún usuario";
                    registerForm.values.password = "";
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
                <div className="hidden sm:block sm:bg-primary sm:w-4/12 md:w-5/12 h-full relative overflow-hidden">
                    <video className="h-full object-cover" autoPlay muted loop id="video-background">
                        <source src={`/${props.chosenVideo}.mp4`} type="video/mp4" />
                        Not supported video format
                    </video>
                    <div className={`p-5 flex justify-center bg-gradient-to-b from-emerald-900 to-emerald-400 opacity-90 absolute bottom-0 right-0 h-full w-full`}>
                    </div>
                </div>
                <div className="h-full grow flex flex-col items-center py-4">
                    <Image src="/logo.png" width={300} height={300} alt="Logo HealthTech" />
                    <div className="w-full px-12">
                        <h2 className={`text-center mb-6 mt-12 text-primary font-bold text-2xl ${robotoBold.className} uppercase`}>Registro</h2>
                        <form className="flex flex-col gap-y-6" onSubmit={registerForm.handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <h3 className={`text-primary font-bold text-lg uppercase`}>Datos Personales</h3>
                                <div className="flex gap-6">
                                    <Input
                                        name="name"
                                        variant="outlined"
                                        className="w-6/12"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.name}
                                        label="Nombre"
                                        error={Boolean(registerForm.touched.name && registerForm.errors.name)}
                                        helperText={registerForm.errors.name && registerForm.touched.name && registerForm.errors.name}
                                    />
                                    <Input
                                        name="surname"
                                        variant="outlined"
                                        className="w-6/12"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.surname}
                                        label="Apellido"
                                        error={Boolean(registerForm.touched.surname && registerForm.errors.surname)}
                                        helperText={registerForm.errors.surname && registerForm.touched.surname && registerForm.errors.surname}
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <Input
                                        name="dni"
                                        variant="outlined"
                                        className="w-6/12"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.dni}
                                        label="DNI"
                                        error={Boolean(registerForm.touched.dni && registerForm.errors.dni)}
                                        helperText={registerForm.errors.dni && registerForm.touched.dni && registerForm.errors.dni}
                                    />
                                    <Input
                                        name="cuit"
                                        variant="outlined"
                                        className="w-6/12"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.cuit}
                                        label="CUIT"
                                        error={Boolean(registerForm.touched.cuit && registerForm.errors.cuit)}
                                        helperText={registerForm.errors.cuit && registerForm.touched.cuit && registerForm.errors.cuit}
                                    />
                                </div>
                                <DatePicker
                                    label="Fecha de Nacimiento"
                                    name="birthday"
                                />
                                <Input
                                    name="phone"
                                    variant="outlined"
                                    onChange={registerForm.handleChange}
                                    onBlur={registerForm.handleBlur}
                                    value={registerForm.values.phone}
                                    label="Teléfono"
                                    error={Boolean(registerForm.touched.phone && registerForm.errors.phone)}
                                    helperText={registerForm.errors.phone && registerForm.touched.phone && registerForm.errors.phone}
                                />
                                <div className="flex gap-6">
                                    <Input
                                        name="province"
                                        variant="outlined"
                                        className="w-6/12"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.province}
                                        label="Provincia"
                                        error={Boolean(registerForm.touched.province && registerForm.errors.province)}
                                        helperText={registerForm.errors.province && registerForm.touched.province && registerForm.errors.province}
                                    />
                                    <Input
                                        name="city"
                                        variant="outlined"
                                        className="w-6/12"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.city}
                                        label="Ciudad"
                                        error={Boolean(registerForm.touched.city && registerForm.errors.city)}
                                        helperText={registerForm.errors.city && registerForm.touched.city && registerForm.errors.city}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <h3 className={`text-primary font-bold text-lg uppercase`}>Datos de la Cuenta</h3>
                                <Input
                                    type="email"
                                    variant="outlined"
                                    name="email"
                                    onChange={registerForm.handleChange}
                                    onBlur={registerForm.handleBlur}
                                    value={registerForm.values.email}
                                    label="E-Mail"
                                    error={Boolean(registerForm.touched.email && registerForm.errors.email)}
                                    helperText={registerForm.errors.email && registerForm.touched.email && registerForm.errors.email}
                                />
                                <div className="flex gap-6">
                                    <Input
                                        type="password"
                                        variant="outlined"
                                        className="w-6/12"
                                        name="password"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.password}
                                        label="Contraseña"
                                        error={Boolean(registerForm.touched.password && registerForm.errors.password)}
                                        helperText={registerForm.errors.password && registerForm.touched.password && registerForm.errors.password}
                                    />
                                    <Input
                                        type="password"
                                        variant="outlined"
                                        className="w-6/12"
                                        name="repeat_password"
                                        onChange={registerForm.handleChange}
                                        onBlur={registerForm.handleBlur}
                                        value={registerForm.values.repeat_password}
                                        label="Repetir contraseña"
                                        error={Boolean(registerForm.touched.repeat_password && registerForm.errors.repeat_password)}
                                        helperText={registerForm.errors.repeat_password && registerForm.touched.repeat_password && registerForm.errors.repeat_password}
                                    />
                                </div>
                            </div>
                            <Button disabled={registerForm.isSubmitting} type="submit">
                                Registrarse
                            </Button>
                        </form>
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

}, { protected: false })


