import React, { useState, useEffect } from "react";
import { Auth } from "../../shared/types";
import withAuth from "@/lib/withAuth";
import Layout from "@/components/layout";
import { roboto } from "@/lib/fonts";
import Input from "@/components/input";
import { FaPaperclip } from "react-icons/fa6";
import { Alert, Autocomplete, IconButton, Snackbar } from "@mui/material";
import Button from "@/components/button";
import DatePicker from "@/components/dateInput";
import { useTheme } from '@mui/material';
import axios from 'axios';
import { useFormik } from "formik";
import dayjs, { Dayjs } from "dayjs";
import * as Yup from "yup";

export default function RegisterDoctor(props: any) {

    const theme = useTheme();

    const [formError, setFormError] = useState(false);
    const registerDoctorForm = useFormik({
        initialValues: {
            registration: null,
            title: null,
            employmentDate: dayjs(),
            specialities: [],
        },
        validationSchema: Yup.object({
            registration: Yup.mixed().required("Debes cargar una matícula válida"),
            title: Yup.mixed().required("Debes cargar un título universitario válido"),
            employmentDate: Yup.date().required(),
            specialities: Yup.array().min(1, "Debes seleccionar al menos una especialidad"),

        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // const temp = { ...values, birthday: values.birthday.toDate() };
                // let registerReq = await axios.post(
                //     `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
                //     temp,
                //     { withCredentials: true }
                // );
                // registerReq = registerReq.data;
                // props.setFullName(
                //     `${registerForm.values.name} ${registerForm.values.surname}`
                // );
                // props.setSuccess(true);
            } catch (error: any) {
                setFormError(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleRegistrationChange = ($e: any) => {
        if (
            $e.target.files &&
            $e.target.files[0] &&
            ($e.target.files[0].type.includes("jpg") ||
                $e.target.files[0].type.includes("jpeg") ||
                $e.target.files[0].type.includes("pdf") ||
                $e.target.files[0].type.includes("png"))
        ) {
            registerDoctorForm.setFieldValue('registration', $e.target.files[0]);
        } else {
            registerDoctorForm.setFieldValue('registration', null);
        }
    };

    const handleTitleChange = ($e: any) => {
        if (
            $e.target.files &&
            $e.target.files[0] &&
            ($e.target.files[0].type.includes("jpg") ||
                $e.target.files[0].type.includes("jpeg") ||
                $e.target.files[0].type.includes("pdf") ||
                $e.target.files[0].type.includes("png"))
        ) {
            registerDoctorForm.setFieldValue('title', $e.target.files[0]);
        } else {
            registerDoctorForm.setFieldValue('title', null);
        }
    };

    return (
        <Layout auth={props.auth}>
            <section className={`${roboto.className} p-10 flex flex-col`}>
                <h2 className="text-primary font-bold text-2xl mb-6">Solicitar la verificación como profesional médico</h2>
                <form
                    className="flex flex-col gap-5"
                    onSubmit={registerDoctorForm.handleSubmit}
                >
                    <Input
                        id="registration"
                        label="Matrícula"
                        onBlur={registerDoctorForm.handleBlur}
                        value={registerDoctorForm.values.registration ? (registerDoctorForm.values.registration as any).name : ""}
                        error={Boolean(
                            registerDoctorForm.touched.registration && registerDoctorForm.errors.registration
                        )}
                        helperText={
                            registerDoctorForm.errors.registration &&
                            registerDoctorForm.touched.registration &&
                            registerDoctorForm.errors.registration
                        }
                        fullWidth
                        variant="outlined"
                        endadornment={
                            <IconButton size="small" onClick={() => { const regIpt = document.getElementById('registration_hidden'); regIpt?.click() }}>
                                <FaPaperclip />
                            </IconButton>
                        }>
                    </Input>
                    <input
                        type="file"
                        id="registration_hidden"
                        className="hidden"
                        onChange={handleRegistrationChange}
                    />
                    <Input
                        label="Título"
                        id="title"
                        onBlur={registerDoctorForm.handleBlur}
                        value={registerDoctorForm.values.title ? (registerDoctorForm.values.title as any).name : ""}
                        error={Boolean(
                            registerDoctorForm.touched.title && registerDoctorForm.errors.title
                        )}
                        helperText={
                            registerDoctorForm.errors.title &&
                            registerDoctorForm.touched.title &&
                            registerDoctorForm.errors.title
                        }
                        fullWidth
                        variant="outlined"
                        endadornment={
                            <IconButton size="small" onClick={() => { const titleIpt = document.getElementById('title_hidden'); titleIpt?.click() }}>
                                <FaPaperclip />
                            </IconButton>
                        }>
                    </Input>
                    <input
                        type="file"
                        id="title_hidden"
                        className="hidden"
                        onChange={handleTitleChange}
                    />
                    <DatePicker
                        label="Año de inicio"
                        name="employmentDate"
                        views={["year"]}
                        onChange={(date: Dayjs) =>
                            registerDoctorForm.setFieldValue("employmentDate", date)
                        }
                        onBlur={registerDoctorForm.handleBlur}
                        value={registerDoctorForm.values.employmentDate}
                        error={Boolean(
                            registerDoctorForm.touched.employmentDate && registerDoctorForm.errors.employmentDate
                        )}
                    />
                    <Autocomplete
                        sx={{
                            "& .MuiChip-root": {
                                border: "1px solid",
                                background: "none",
                                borderColor: theme.palette.primary.main,
                            }
                        }}
                        multiple
                        onChange={(event, newValue: any) => {
                            const specialitiesIds = newValue.map((nV: any) => nV.id);
                            registerDoctorForm.setFieldValue("specialities", specialitiesIds);
                        }}
                        disablePortal
                        noOptionsText="No se encontraron Especialidades"
                        options={props.specialities.map((spec: any) => ({
                            id: spec.id,
                            label: spec.name,
                        }))}
                        renderInput={(params: any) => (
                            <Input
                                error={Boolean(
                                    registerDoctorForm.touched.specialities && registerDoctorForm.errors.specialities
                                )}
                                helperText={
                                    registerDoctorForm.errors.specialities &&
                                    registerDoctorForm.touched.specialities &&
                                    registerDoctorForm.errors.specialities
                                }
                                variant="outlined"
                                onChange={registerDoctorForm.handleChange}
                                onBlur={registerDoctorForm.handleBlur}
                                name="specialities"
                                {...params}
                                label="Especialidades"
                            />
                        )}
                    />
                    <Button type="submit">
                        ACEPTAR
                    </Button>
                </form>
                {/* <Snackbar
                    open={error}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={4000}
                    onClose={() => setError(false)}
                >
                    <Alert elevation={6} variant="filled" severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar> */}
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

        let specialities = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/speciality`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${context.req.cookies.token}` },
            }
        );

        specialities = specialities.data;

        return {
            props: {
                auth,
                specialities,
            },
        };
    },
    { protected: true }
);
