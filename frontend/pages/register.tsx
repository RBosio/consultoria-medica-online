import Layout from "@/components/layout";
import { useFormik } from "formik";
import Input from "@/components/input";
import Button from "@/components/button";
import { robotoBold, roboto } from '@/lib/fonts';
import { Autocomplete, useTheme } from "@mui/material";
import Image from "next/image";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../shared/types";
import axios from "axios";
import * as Yup from 'yup';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "@/components/dateInput";
import dayjs, { Dayjs } from "dayjs";
import { CiCircleCheck } from "react-icons/ci";

export default function Register(props: any) {

    const [success, setSuccess] = useState(false);

    return (
        <Layout auth={props.auth} renderNavbar={false} renderSidebar={false}>
            <section className={`h-full flex overflow-hidden ${roboto.className}`}>
                <div className="hidden sm:block sm:bg-primary sm:w-4/12 md:w-5/12 h-full relative overflow-hidden">
                    <video className="h-full object-cover" autoPlay muted loop id="video-background">
                        <source src={`/${props.chosenVideo}.mp4`} type="video/mp4" />
                        Not supported video format
                    </video>
                    <div className={`p-5 flex justify-center bg-gradient-to-b from-emerald-900 to-emerald-400 opacity-90 absolute bottom-0 right-0 h-full w-full`}>
                    </div>
                </div>
                <div className="h-full grow flex flex-col items-center py-4 overflow-y-auto">
                    <Image src="/logo.png" width={300} height={300} alt="Logo HealthTech" />
                    {success ? <RegisterSuccess/> : <RegisterForm setSuccess={setSuccess}/>}
                </div>
            </section>
        </Layout >
    );

};

const RegisterSuccess: React.FC = () => {
    const router = useRouter();

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-11/12 sm:w-9/12 lg:w-6/12 shadow-lg">
                <div className="bg-primary w-full flex justify-center p-2">
                    <CiCircleCheck color="#ffffff" size={100} />
                </div>
                <div className="flex justify-center flex-col items-center p-6 gap-4 text-center">
                    <h2 className="text-xl">Bienvenido <span className="text-primary font-bold">Nombre y Apellido</span></h2>
                    <h3 className="text-lg">Tu cuenta ha sido creada con éxito</h3>
                    <Button onClick={() => router.push('/login')}>Acceder</Button>
                </div>
            </div>
        </div>
    );
};

const RegisterForm: React.FC<any> = (props) => {

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
            birthday: dayjs(),
            phone: '',
            province: '',
            city: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Debes ingresar tu nombre').min(1, 'El nombre debe tener al menos 1 carácter'),
            surname: Yup.string().required('Debes ingresar tu apellido').min(1, 'El apellido debe tener al menos 1 carácter'),
            dni: Yup.string().required('Debes ingresar tu DNI').matches(/^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/, 'Debes ingresar un DNI válido'),
            cuit: Yup.string().required('Debes ingresar tu CUIT').matches(/^(20|23|24|27|30|33|34)\d{8}\d{1}$/gm, 'Debes ingresar un CUIT válido'),
            email: Yup.string().required('Debes ingresar tu e-mail').email('Debes ingresar un mail válido'),
            phone: Yup.string().required('Debes ingresar tu teléfono').matches(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/, 'Debes ingresar un teléfono válido'),
            password: Yup.string().required('Debes ingresar tu contraseña').min(8, 'La contraseña debe tener al menos 8 carácteres'),
            repeat_password: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir').required('Debes confirmar tu contraseña'),
            birthday: Yup.date().required(),
            city: Yup.number().required("Debes ingresar tu ciudad"),
            province: Yup.number().typeError("Debes ingresar tu provincia").required("Debes ingresar tu provincia"),

        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                props.setSuccess(true);
                // Lógica backend
            }
            catch (error: any) {
                if ([404, 401].includes(error.response.status)) {

                } else {
                    setFormError(true);
                };
            }
            finally {
                setSubmitting(false);
            }
        },
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const getProvinces = async () => {
            let provinces: any = await axios.get('https://apis.datos.gob.ar/georef/api/provincias');
            provinces = provinces.data;
            setProvinces(provinces.provincias.map((p: any) => ({ id: p.id, label: p.nombre })))
        };

        getProvinces();

    }, []);

    useEffect(() => {
        const getCities = async () => {
            let cities: any = await axios.get(`https://apis.datos.gob.ar/georef/api/departamentos?provincia=${registerForm.values.province}&max=135`);
            cities = cities.data;
            setCities(cities.departamentos.map((c: any) => ({ id: c.id, label: c.nombre })));
        };

        if (!registerForm.values.province) return;
        getCities();

    }, [registerForm.values.province]);

    return (
        <div className="w-full px-12">
            <h2 className={`text-center mb-6 mt-12 text-primary font-bold text-2xl ${robotoBold.className} uppercase`}>Registro</h2>
            <Snackbar open={formError} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={4000} onClose={() => { setFormError(false) }}>
                <Alert elevation={6} variant="filled" severity="error">Se ha producido un error</Alert>
            </Snackbar>
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
                        onChange={(date: Dayjs) => registerForm.setFieldValue('birthday', date)}
                        onBlur={registerForm.handleBlur}
                        value={registerForm.values.birthday}
                        error={Boolean(registerForm.touched.birthday && registerForm.errors.birthday)}
                        className="w-full"

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
                        <Autocomplete
                            className="w-6/12"
                            onChange={(event, newValue: any) => {
                                registerForm.setFieldValue('province', newValue ? newValue.id : "");
                            }}
                            disablePortal
                            noOptionsText="No se encontraron Provincias"
                            options={provinces}
                            renderInput={(params: any) => <Input
                                error={Boolean(registerForm.touched.province && registerForm.errors.province)}
                                helperText={registerForm.errors.province && registerForm.touched.province && registerForm.errors.province}
                                variant="outlined"
                                onChange={registerForm.handleChange}
                                onBlur={registerForm.handleBlur}
                                name="province" {...params}
                                label="Provincia" />}
                        />
                        <Autocomplete
                            className="w-6/12"
                            onChange={(event, newValue: any) => {
                                registerForm.setFieldValue('city', newValue ? newValue.id : "");
                            }}
                            disablePortal
                            noOptionsText="No se encontraron Departamentos"
                            options={cities}
                            renderInput={(params: any) => <Input
                                error={Boolean(registerForm.touched.city && registerForm.errors.city)}
                                helperText={registerForm.errors.city && registerForm.touched.city && registerForm.errors.city}
                                variant="outlined"
                                onChange={registerForm.handleChange}
                                onBlur={registerForm.handleBlur}
                                name="city" {...params} label="Departamento" />}
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

