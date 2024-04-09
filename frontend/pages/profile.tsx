import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@/components/avatar";
import {
  FaAddressCard,
  FaCalendarDays,
  FaCertificate,
  FaCheck,
  FaChevronRight,
  FaCircleCheck,
  FaCircleXmark,
  FaCity,
  FaEnvelope,
  FaKey,
  FaMars,
  FaPaperclip,
  FaPhone,
  FaUser,
  FaVenus,
  FaXmark,
} from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import Input from "@/components/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/button";
import {
  Alert,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/router";
import { Auth } from "../../shared/types";
import { HealthInsuranceResponseDto } from "../components/dto/healthInsurance.dto";
import withAuth from "@/lib/withAuth";
import Layout from "@/components/layout";
import { roboto } from '@/lib/fonts';

export default function ProfileView(props: any) {

  const router = useRouter();

  const [change, setChange] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [request, setRequest] = useState<boolean>(false);
  const [healthInsurances, setHealthInsurances] = useState<
    HealthInsuranceResponseDto[]
  >([]);
  const [healthInsurance, setHealthInsurance] = useState<number>(-1);
  const [file, setFile] = useState<any>();
  const [type, setType] = useState<string>("");

  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirmVerification, setConfirmVerification] =
    useState<boolean>(false);
  const [confirmHealthInsurance, setConfirmHealthInsurance] =
    useState<boolean>(false);

  function showDni() {
    let dni = user.dni;

    dni = dni
      .split("")
      .map((l: string, i: number) => {
        if (i === 2 || i === 5) {
          return "." + l;
        }

        return l;
      })
      .join("");

    return dni;
  }

  function handleChangeFile($e: any) {
    if ($e.target.files && $e.target.files[0]) {
      setFile($e.target.files[0]);
      setType($e.target.files[0].type);
    }
  }

  const uploadFile = async () => {
    if (
      file &&
      (type.includes("jpg") ||
        type.includes("jpeg") ||
        type.includes("png") ||
        type.includes("pdf"))
    ) {
      const fd = new FormData();
      fd.append("file", file);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.dni}/healthInsurance`,
        fd,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );
    }
  };

  const changePass = useFormik({
    initialValues: {
      newPassword: "",
      repeatPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().required("Debes ingresar tu contraseña"),
      repeatPassword: Yup.string().required("Debes re-ingresar tu contraseña"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (values.newPassword === values.repeatPassword) {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${props.auth.id}`,
            {
              password: values.newPassword,
            },
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${props.auth.token}` },
            }
          );

          setChange(false);
          setUpdated(true);
          setMessage("Contraseña actualizada con éxito!");
          setSuccess(true);
          changePass.resetForm();
        } else {
          setError(true);
          setMessage("Las contraseñas deben ser iguales!");
        }
      } catch (error: any) {
        console.error(error);
      }
    },
  });

  const onConfirmClick = async () => {
    if (confirm) {
      await changePass.submitForm();
      setConfirm(false);
    } else if (confirmVerification) {
      handleClickVerification();
      setConfirmVerification(false);
    } else if (confirmHealthInsurance) {
      handleClickHealthInsurance();
      setConfirmHealthInsurance(false);
    }
  };

  function handleClickFile() {
    const file = document.getElementById("file");
    file?.click();
  }

  async function handleChange($e: any) {
    if (
      $e.target.files &&
      $e.target.files[0] &&
      ($e.target.files[0].type.includes("jpg") ||
        $e.target.files[0].type.includes("jpeg") ||
        $e.target.files[0].type.includes("png"))
    ) {
      const fd = new FormData();
      fd.append("file", $e.target.files[0]);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.dni}/image`,
        fd,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      router.push(router.pathname);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${props.auth.dni}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setHealthInsurances(
        props.healthInsurances.filter((hi: any) => {
          return !user.data.healthInsurances
            .map((h: any) => h.healthInsuranceId)
            .includes(hi.id);
        })
      );

      const department = await axios.get(
        `https://apis.datos.gob.ar/georef/api/departamentos?id=${user.data.city}`
      );

      const data = department.data.departamentos[0];
      const departmentName = data.nombre;
      const provinceName = data.provincia.nombre;

      setUser({
        ...user.data,
        department: departmentName,
        province: provinceName,
      });
    };

    fetchUser();

    const request = async () => {
      const request = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/${props.auth.id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      if (request.data.lenth > 0) {
        setRequest(true);
      }
    };

    request();
  }, [healthInsurance]);

  const handleClickVerification = async () => {
    const user = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/admin`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notification`,
      {
        userIdSend: props.auth.id,
        userIdReceive: user.data.id,
        type: "health",
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Solicitud realizada con éxito!");
    setSuccess(true);

    router.push(router.pathname);
  };

  const handleClickHealthInsurance = async () => {
    if (!file || !healthInsurance) {
      setMessage("Debes seleccionar una obra social y un archivo!");
      setError(true);
      return;
    }

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/healthInsurance/${props.auth.id}`,
      {
        healthInsuranceId: healthInsurance,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    await uploadFile();

    setMessage("Obra social agregada con éxito!");
    setSuccess(true);

    setHealthInsurance(-1);
    setFile("");
    setType("");

    // router.push("/profile");
  };


  return (
    <Layout auth={props.auth}>
      <section className={`flex ${roboto.className}`}>
        {user && (
          <div className="my-12 flex flex-col md:flex-row justify-center w-full gap-4 md:mx-12">
            <section className="bg-white p-16 rounded-lg shadow-lg md:w-1/3">
              <div className="flex flex-col justify-center items-center gap-4">
                <div>
                  <Avatar
                    labelProps={{ className: "hidden" }}
                    name={user.name}
                    surname={user.surname}
                    className="bg-primary hover:cursor-pointer hover:opacity-70"
                    size={200}
                    icon={<FaUser size={100} />}
                    photo={user.image ? `${user.image}` : undefined}
                    onClick={handleClickFile}
                  />
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={handleChangeFile}
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col items-center p-2 w-full">
                    <h2 className={`text-primary ${robotoBold.className} text-3xl`}>
                      {user.name} {user.surname}
                    </h2>
                    <div className="flex items-center">
                      <FaEnvelope className="text-primary size-4" />
                      <p className="mx-2 text-xl">{user.email}</p>
                    </div>
                    <div className="flex items-center">
                      <FaCity className="text-primary size-4" />
                      <p className="mx-2 text-xl">
                        {user.department}, {user.province}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaAddressCard className="text-primary size-4" />
                      <p className="mx-2 text-xl">{showDni()}</p>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-primary size-4" />
                      <p className="mx-2 text-xl">{user.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarDays className="text-primary size-4" />
                      <p className="mx-2 text-xl">
                        {moment().diff(user.birthday, "years")} años
                      </p>
                    </div>
                    <div className="flex items-center">
                      {user.gender ? (
                        <FaMars className="text-primary size-4" />
                      ) : (
                        <FaVenus className="text-primary size-4" />
                      )}

                      <p className="mx-2 text-xl">
                        {user.gender ? "Hombre" : "Mujer"}
                      </p>
                    </div>
                    <div className="w-full">
                      {/* {user.validateHealthInsurance ? (
                  <FaCheck className="text-xl text-green-600" />
                  ) : (
                    <FaXmark className="text-xl text-red-600" />
                  )} */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-white p-12 rounded-lg shadow-lg md:w-full">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h4 className="text-primary text-3xl mt-2 font-bold">
                    Obras sociales
                  </h4>
                  <div>
                    {user.healthInsurances.map((h: any, idx: number) => {
                      return (
                        <div className="p-4" key={idx}>
                          {h.healthInsurance?.name ? (
                            <div className="flex items-center gap-4">
                              <FaChevronRight className="text-primary text-md size-6" />
                              <p className="text-xl">{h.healthInsurance.name}</p>
                              {h.verified ? (
                                <FaCircleCheck className="text-green-600 text-lg size-6" />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <FaCircleXmark className="text-red-600 text-lg size-6" />
                                  {!request && (
                                    <FaCertificate
                                      className="text-primary text-lg hover:cursor-pointer hover:opacity-70 size-6"
                                      onClick={() => {
                                        setConfirmVerification(true);
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="my-4 md:flex gap-4">
                    <div className="flex items-center gap-4 md:w-full">
                      <div className="w-full">
                        <Autocomplete
                          onChange={(event, newValue: any) => {
                            setHealthInsurance(newValue?.id);
                          }}
                          disablePortal
                          noOptionsText="Especialidad no encontrada"
                          options={healthInsurances.map((hi: any) => ({
                            id: hi.id,
                            label: hi.name,
                          }))}
                          renderInput={(params: any) => (
                            <Input
                              onChange={() => { }}
                              name="healthInsuranceId"
                              {...params}
                              label="Obra social"
                            />
                          )}
                        />
                      </div>
                      <input
                        type="file"
                        id="file"
                        className="hidden"
                        onChange={handleChange}
                      />
                      <FaPaperclip
                        className="text-primary text-xl hover:cursor-pointer hover:opacity-70"
                        onClick={handleClickFile}
                      />
                    </div>
                    <div className="flex justify-center mt-2 md:block">
                      <Button
                        startIcon={<FaCheck />}
                        onClick={() => {
                          setConfirmHealthInsurance(true);
                        }}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                  {file && (
                    <div
                      className={`w-full py-1 px-2 bg-primary rounded-md text-white flex justify-between items-center overflow-x-hidden h-8 ${file.name.length > 60 ? "overflow-y-scroll" : ""
                        }`}
                    >
                      <div className={`${robotoBold.className}`}>{file.name}</div>
                      <FaXmark
                        className="hover:cursor-pointer hover:opacity-70"
                        onClick={() => {
                          setFile("");
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-12">
                <h4 className="text-primary text-3xl mt-2 font-bold">Contraseña</h4>
                <div className="flex flex-col">
                  <div className="flex justify-center items-center p-2">
                    <FaKey className="text-primary mr-2" />
                    <div className="border border-primary w-full md:w-1/2 md:px-2 p-1">
                      <p className="text-center">**********</p>
                    </div>
                    <FaEdit
                      className="text-primary ml-2 text-xl hover:cursor-pointer hover:opacity-70"
                      onClick={() => setChange(true)}
                    />
                  </div>
                  {change ? (
                    <div className="mt-12">
                      <h4 className="text-primary text-3xl mt-2 font-bold">
                        Cambiar contraseña
                      </h4>
                      <form
                        className="flex flex-col justify-center items-center gap-2 mt-2 md:w-1/2 mx-auto"
                        onSubmit={changePass.handleSubmit}
                      >
                        <Input
                          className="w-full"
                          type="password"
                          name="newPassword"
                          onChange={changePass.handleChange}
                          onBlur={changePass.handleBlur}
                          value={changePass.values.newPassword}
                          label="Nueva contraseña"
                          error={Boolean(
                            changePass.touched.newPassword &&
                            changePass.errors.newPassword
                          )}
                          helperText={
                            changePass.errors.newPassword &&
                            changePass.touched.newPassword &&
                            changePass.errors.newPassword
                          }
                        />
                        <Input
                          className="w-full"
                          type="password"
                          name="repeatPassword"
                          onChange={changePass.handleChange}
                          onBlur={changePass.handleBlur}
                          value={changePass.values.repeatPassword}
                          label="Repita la contraseña"
                          error={Boolean(
                            changePass.touched.repeatPassword &&
                            changePass.errors.repeatPassword
                          )}
                          helperText={
                            changePass.errors.repeatPassword &&
                            changePass.touched.repeatPassword &&
                            changePass.errors.repeatPassword
                          }
                        />
                        <Button onClick={() => setConfirm(true)}>Aceptar</Button>
                      </form>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </section>
            <Dialog
              open={confirm || confirmVerification || confirmHealthInsurance}
              onClose={() => {
                setConfirm(false);
                setConfirmVerification(false);
                setConfirmHealthInsurance(false);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {confirm
                  ? "Confirmar cambio"
                  : confirmVerification
                    ? "Confirmar solicitud"
                    : confirmHealthInsurance
                      ? "Confirmar solicitud"
                      : ""}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {confirm
                    ? "¿Estás seguro que deseas cambiar la contraseña?"
                    : confirmVerification
                      ? "Estás seguro que deseas solicitar la verificación de la obra social?"
                      : confirmHealthInsurance
                        ? "Estás seguro que deseas agregar la obra social?"
                        : ""}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="error"
                  variant="text"
                  onClick={() => {
                    setConfirm(false);
                    setConfirmVerification(false);
                    setConfirmHealthInsurance(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={onConfirmClick} autoFocus>
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              open={updated || success}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={4000}
              onClose={() => {
                setUpdated(false);
                setSuccess(false);
              }}
            >
              <Alert elevation={6} variant="filled" severity="success">
                {message}
              </Alert>
            </Snackbar>
            <Snackbar
              open={error}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={4000}
              onClose={() => setError(false)}
            >
              <Alert elevation={6} variant="filled" severity="error">
                {message}
              </Alert>
            </Snackbar>
          </div>
        )}
      </section>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
    let healthInsurances = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    healthInsurances = healthInsurances.data;
    return {
      props: {
        auth,
        healthInsurances,
      },
    };
  },
  { protected: true }
);
