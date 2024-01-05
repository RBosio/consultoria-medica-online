import Layout from "@/components/layout";
import { Formik } from "formik";
import { Roboto } from "next/font/google";

const robotoBold = Roboto({weight:"900", subsets:["latin"]});

export default function Login() {

    return (
        <Layout>
            <section className="h-full flex">

                <div className="h-full grow flex items-center justify-center">

                    <div className="px-12 w-full sm:px-0 sm:w-[25rem] md:w-[30rem]">
                        
                        <h2 className={`text-center my-6 text-emerald-400 font-bold text-2xl ${robotoBold.className}`}>Ingresar</h2>

                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validate={values => {
                                const errors = {email: ""};
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
                                /* and other goodies */
                            }) => (
                                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                    <input
                                        className="border-2 outline-0 text-emerald-400 rounded p-3"
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        placeholder="Email"
                                    />
                                    <input
                                    className="border-2 outline-0 text-emerald-400 rounded p-3"
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        placeholder="Contraseña"
                                    />
                                    <button className="bg-emerald-400 rounded p-3" type="submit" disabled={isSubmitting}>
                                        Ingresar
                                    </button>
                                </form>
                            )}
                        </Formik>

                    </div>
                </div>

                <div className="
            sm:bg-emerald-400 sm:w-4/12 md:w-5/12 h-full
            bg-gradient-to-l from-emerald-500 to-emerald-200
            ">

                </div>

            </section>
        </Layout>
    );

};
