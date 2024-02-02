import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@/components/avatar";
import {
  FaAddressCard,
  FaCalendarDays,
  FaCheck,
  FaEnvelope,
  FaKey,
  FaMars,
  FaPhone,
  FaSuitcaseMedical,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/router";
import { Auth } from "../../shared/types";

interface ProfileProps {
  auth: Auth;
}

const Profile: React.FC<ProfileProps> = (props) => {

  const router = useRouter();

  const [change, setChange] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<any>(null);

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
            `${process.env.NEXT_PUBLIC_API_URL}/user/${props.auth.dni}`,
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
          setChanged(true);
        } else {
          setError(true);
        }
      } catch (error: any) {
        console.error(error);
      }
    },
  });

  const onConfirmClick = async () => {
    await changePass.submitForm();
    setConfirm(false);
  };

  function handleClickFile() {
    const file = document.getElementById("file");
    file?.click();
  }

  async function handleChange($e: any) {
    if ($e.target.files && $e.target.files[0] && ($e.target.files[0].type.includes("jpg") ||
      $e.target.files[0].type.includes("jpeg") ||
      $e.target.files[0].type.includes("png"))) {
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

      setUser({ ...user.data });
    }

    fetchUser();

  }, []);

  return (
    user && <section className="bg-white mt-20 mx-auto">
      <div className="flex justify-center relative">
        <Avatar
          labelProps={{ className: "hidden" }}
          name={user.name}
          surname={user.surname}
          className="absolute z-10 left-[calc(50%-65px)] bg-primary hover:cursor-pointer hover:opacity-70"
          size={130}
          icon={<FaUser size={60} />}
          photo={user.image ? `${user.image}` : undefined}
          onClick={handleClickFile}
        />
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-center relative">
        <div className="mt-16">
          <h2
            className={`text-primary text-center ${robotoBold.className} text-3xl`}
          >
            {user.name} {user.surname}
          </h2>
        </div>
      </div>
      <div
        className="bg-emerald-200 w-3/4 mt-1 mx-auto"
        style={{ height: "1px" }}
      ></div>
      <div className="md:flex md:justify-center">
        <div className="md:w-1/2">
          <h2 className="text-primary text-xl text-center mt-2">
            Datos personales
          </h2>
          <div className="flex flex-col items-center p-2">
            <div className="flex items-center">
              <FaEnvelope className="text-primary" />
              <p className="mx-2">{user.email}</p>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-primary" />
              <p className="mx-2">{user.phone}</p>
            </div>
            <div className="flex items-center">
              <FaAddressCard className="text-primary" />
              <p className="mx-2">{showDni()}</p>
            </div>
            <div className="flex items-center">
              <FaCalendarDays className="text-primary" />
              <p className="mx-2">
                {moment().diff(user.birthday, "years")} años
              </p>
            </div>
            <div className="flex items-center">
              {user.gender ? (
                <FaMars className="text-primary" />
              ) : (
                <FaVenus className="text-primary" />
              )}

              <p className="mx-2">{user.gender ? "Hombre" : "Mujer"}</p>
            </div>
            <div className="flex justify-center items-center w-full">
              <FaSuitcaseMedical className="text-primary" />
              <div className="flex">
                {user.healthInsurances.map((h: any, idx: number) => {
                  return (
                    <div className="flex" key={idx}>
                      <p key={idx} className="mx-2">
                        {h.name}
                      </p>
                      <p>
                        {idx < user.healthInsurances.length - 1
                          ? "|"
                          : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
              {user.validateHealthInsurance ? (
                <FaCheck className="text-xl text-green-600" />
              ) : (
                <FaXmark className="text-xl text-red-600" />
              )}
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-primary text-xl text-center mt-2">Seguridad</h2>
          <div className="flex flex-col">
            <div className="flex justify-center items-center p-2">
              <FaKey className="text-primary mr-2" />
              <div className="border border-gray-200 w-1/2 md:px-2">
                <p className="text-center">**********</p>
              </div>
              <FaEdit
                className="text-primary ml-2 text-xl hover:cursor-pointer hover:opacity-70"
                onClick={() => (changed ? "" : setChange(true))}
              />
            </div>
            {change ? (
              <div className="p-4">
                <h2 className="text-primary text-sm">Cambiar contraseña</h2>
                <form
                  className="flex flex-col justify-center items-center gap-2 mt-2"
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
      </div>
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar cambio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas cambiar la contraseña?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="text"
            onClick={() => setConfirm(false)}
          >
            Cancelar
          </Button>
          <Button onClick={onConfirmClick} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={updated}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={() => setUpdated(false)}
      >
        <Alert elevation={6} variant="filled" severity="success">
          Contraseña actualizada con exito!
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={() => setError(false)}
      >
        <Alert elevation={6} variant="filled" severity="error">
          Las contraseñas deben ser iguales!
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Profile;