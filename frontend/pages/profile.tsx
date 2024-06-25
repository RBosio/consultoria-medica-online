import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@/components/avatar";
import {
  FaAddressCard,
  FaCalendarDays,
  FaCheck,
  FaChevronRight,
  FaCity,
  FaEnvelope,
  FaKey,
  FaLocationDot,
  FaMars,
  FaPhone,
  FaTrash,
  FaUser,
  FaVenus,
} from "react-icons/fa6";
import { robotoBold } from "@/lib/fonts";
import moment from "moment";
import "moment/locale/es";
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
  IconButton,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/router";
import { Auth } from "../../shared/types";
import { HealthInsuranceResponseDto } from "../components/dto/healthInsurance.dto";
import withAuth from "@/lib/withAuth";
import Layout from "@/components/layout";
import { roboto } from "@/lib/fonts";

export default function ProfileView(props: any) {
  const router = useRouter();

  const [change, setChange] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [healthInsurances, setHealthInsurances] = useState<
    HealthInsuranceResponseDto[]
  >([]);
  const [healthInsurance, setHealthInsurance] = useState<any>({
    id: 0,
    label: "",
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirmDeleteHi, setConfirmDeleteHi] = useState<boolean>(false);
  const [confirmHealthInsurance, setConfirmHealthInsurance] =
    useState<boolean>(false);
  const [cod, setCod] = useState<string>("");
  const [hiToDelete, setHiToDelete] = useState<number>(-1);

  useEffect(() => {
    moment.locale("es");
  }, []);

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
      handleChange($e);
    }
  }

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
      if (values.newPassword.length < 8 || values.repeatPassword.length < 8) {
        setError(true);
        setMessage("La contraseña debe tener al menos 8 caracteres");
        return;
      }

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

  const handleClickDeleteHi = async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/user/unsetHI/${hiToDelete}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Obra social eliminada con éxito!");
    setSuccess(true);

    setHiToDelete(-1);
  };

  const onConfirmClick = async () => {
    if (confirm) {
      await changePass.submitForm();
      setConfirm(false);
    } else if (confirmHealthInsurance) {
      handleClickHealthInsurance();
      setConfirmHealthInsurance(false);
    } else if (confirmDeleteHi) {
      handleClickDeleteHi();
      setConfirmDeleteHi(false);
    }
  };

  function handleClickFile($e: any, hi?: boolean) {
    if (hi) {
      const file = document.getElementById("file2");
      file?.click();
    } else {
      const file = document.getElementById("file");
      file?.click();
    }
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

      const u = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.dni}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setSuccess(true);
      setMessage("Imagen actualizada con éxito!");
      setUser({ ...user, image: u.data.image });

      localStorage.setItem('refreshSession', '1');
      
      router.push(router.pathname);
    } else {
      setError(true);
      setMessage("Debes seleccionar una imagen!");
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
  }, [healthInsurance, hiToDelete]);

  const handleClickHealthInsurance = async () => {
    if (healthInsurance.id === 0) {
      setMessage("Debes seleccionar una obra social!");
      setError(true);
      return;
    }

    if (props.auth.role !== "doctor" && !cod) {
      setMessage("Debes ingresar un número de afiliado!");
      setError(true);
      return;
    }

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/healthInsurance/${props.auth.id}`,
      {
        healthInsuranceId: healthInsurance.id,
        cod,
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Obra social agregada con éxito!");
    setSuccess(true);

    setHealthInsurance(null);
    setCod("");
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
                    <h2
                      className={`text-primary ${robotoBold.className} text-3xl text-center`}
                    >
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
                      <FaLocationDot className="text-primary size-4" />
                      <p className="mx-2 text-xl">{user.address}</p>
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
                        {user.gender ? "Masculino" : "Femenino"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-white p-12 rounded-lg shadow-lg md:w-full">
              {props.auth.role !== "doctor" && (
                <div className="flex flex-col w-full lg:w-10/12 xl:w-8/12">
                  <h4 className="text-primary text-3xl mt-2 font-bold">
                    Obras sociales
                  </h4>
                  <div className="flex flex-col lg:flex-row gap-4 my-4 w-full">
                    <Autocomplete
                      className={"w-full"}
                      value={healthInsurance}
                      onChange={(event, newValue: any) => {
                        setHealthInsurance(newValue);
                      }}
                      disablePortal
                      noOptionsText="Obra social no encontrada"
                      options={healthInsurances.map((hi: any) => ({
                        id: hi.id,
                        label: hi.name,
                      }))}
                      renderInput={(params: any) => (
                        <Input
                          onChange={() => {}}
                          name="healthInsuranceId"
                          {...params}
                          label="Obra social"
                        />
                      )}
                    />
                    <Input
                      className="w-full"
                      label="Número de afiliado"
                      onChange={($e) => setCod($e.target.value)}
                      value={cod}
                    ></Input>
                    <Button
                      className="h-1/2 shrink-0"
                      startIcon={<FaCheck />}
                      onClick={() => {
                        setConfirmHealthInsurance(true);
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                  <div>
                    {user.healthInsurances.map((h: any, idx: number) => {
                      return (
                        <div className="p-1" key={idx}>
                          {h.healthInsurance?.name ? (
                            <div className="flex items-center gap-1">
                              <FaChevronRight className="text-primary text-md size-4" />
                              <p className="text-md">
                                {h.healthInsurance.name} (num. {h.cod})
                              </p>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setHiToDelete(h.healthInsurance.id);
                                  setConfirmDeleteHi(true);
                                }}
                              >
                                <FaTrash className="text-error" size={15} />
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className={`${props.auth.role !== "doctor" && "mt-12"}`}>
                <h4 className="text-primary text-3xl mt-2 font-bold">
                  Contraseña
                </h4>
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
                  {change && (
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
                        <Button onClick={() => setConfirm(true)}>
                          Aceptar
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <Dialog
              open={confirm || confirmHealthInsurance || confirmDeleteHi}
              onClose={() => {
                setConfirm(false);
                setConfirmHealthInsurance(false);
                setConfirmDeleteHi(true);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {confirm
                  ? "Confirmar cambio"
                  : confirmHealthInsurance
                  ? "Confirmar obra social"
                  : confirmDeleteHi
                  ? "Confirmar eliminación"
                  : ""}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {confirm
                    ? "¿Estás seguro que deseas cambiar la contraseña?"
                    : confirmHealthInsurance
                    ? "Estás seguro que deseas agregar la obra social?"
                    : confirmDeleteHi
                    ? "Estás seguro que deseas eliminar esta obra social?"
                    : ""}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="error"
                  variant="text"
                  onClick={() => {
                    setConfirm(false);
                    setConfirmHealthInsurance(false);
                    setConfirmDeleteHi(false);
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
  { protected: true, roles: ['user', 'doctor', 'admin'] }
);
