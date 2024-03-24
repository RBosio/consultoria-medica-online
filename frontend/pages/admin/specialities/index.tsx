import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { PRIMARY_COLOR } from "@/constants";

interface Speciality {
  auth: Auth;
  specialities: SpecialityResponseDto[];
}

export default function Home(props: Speciality) {
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [cancel, setCancel] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [page, setPage] = useState<any>();

  useEffect(() => {
    setPage(1);
    setSpecialities(
      props.specialities.filter((sp, idx) => idx >= 4 * 0 && idx < 4)
    );
  }, []);

  const pagination = (p: number, sp?: SpecialityResponseDto[]) => {
    if (!sp) {
      if (p === 0 || p === Math.ceil(props.specialities.length / 4) + 1) return;

      setPage(p);
      setSpecialities(
        props.specialities.filter(
          (sp, idx) => idx >= 4 * (p - 1) && idx < 4 * p
        )
      );
    } else {
      setPage(p);
      setSpecialities(sp.filter((s, idx) => idx >= 4 * (p - 1) && idx < 4 * p));
    }
  };

  const addSpeciality = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/speciality`,
        values,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      let specialities = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/speciality`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      addSpeciality.values.name = "";

      setConfirm(false);
      setAdd(false);

      setSpecialities(specialities.data);
      pagination(page, specialities.data);

      setMessage("Especialidad agregada correctamente!");
      setSuccess(true);
      router.push(`/admin/specialities`);
    },
  });

  const editSpeciality = useFormik({
    initialValues: {
      id: 0,
      name: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/speciality/${values.id}`,
        { name: values.name },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      let specialities = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/speciality`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setUpdate(false);
      setEdit(false);
      setCancel(false);

      setMessage("Especialidad editada correctamente!");
      setSuccess(true);

      setSpecialities(specialities.data);
      pagination(page, specialities.data);

      router.push(`/admin/specialities`);
    },
  });

  const deleteSpeciality = async () => {
    const id = localStorage.getItem("specialityId");
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/speciality/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${props.auth.token}` },
    });

    setUpdate(false);
    setEdit(false);
    setCancel(false);

    setMessage("Especialidad eliminada correctamente!");
    setSuccess(true);

    setSpecialities(props.specialities.filter((sp) => sp.id != Number(id)));
    pagination(
      page,
      props.specialities.filter((sp) => sp.id != Number(id))
    );

    router.push(`/admin/specialities`);
  };

  const onConfirmClick = () => {
    if (addSpeciality.values.name.length > 0) {
      addSpeciality.handleSubmit();
    } else if (cancel) {
      deleteSpeciality();
    } else if (editSpeciality.values.name.length > 0) {
      editSpeciality.handleSubmit();
    } else {
      setConfirm(false);
      setAdd(false);
      setEdit(false);
    }
  };

  const showEdit = async (id: number) => {
    setAdd(false);
    setEdit(false);
    const sp = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/speciality/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    editSpeciality.setValues({
      id: sp.data.id,
      name: sp.data.name,
    });

    setEdit(true);
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-center gap-4 w-[90%] mt-12">
          <div>
            <SidebarAdmin
              auth={props.auth}
              setSidebarOpened={true}
              sidebarOpened
            />
          </div>
          <div className="bg-white p-4 w-full h-full">
            <section className="w-full rounded-md flex flex-col items-center relative">
              <div className="w-5/6">
                <div className="flex justify-end">
                  <Button
                    startIcon={<FaPlus />}
                    onClick={() => {
                      setEdit(false);
                      setAdd(true);
                    }}
                  >
                    Agregar
                  </Button>
                </div>
                <div className="flex justify-end items-center gap-2 text-primary py-4">
                  <FaChevronLeft
                    className="text-2xl hover:cursor-pointer"
                    onClick={() => {
                      pagination(page - 1);
                    }}
                  />

                  <FaChevronRight
                    className="text-2xl hover:cursor-pointer"
                    onClick={() => {
                      pagination(page + 1);
                    }}
                  />

                  <p className="text-md">
                    Pagina {page ? page : 1} -{" "}
                    {Math.ceil(props.specialities.length / 4)}
                  </p>
                </div>
                <TableContainer component={Paper}>
                  <Table aria-label="medical record table">
                    <TableHead sx={{ bgcolor: PRIMARY_COLOR }}>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          #
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Nombre
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Operaciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {specialities.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            {row.id}
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            <div className="flex justify-center items-center gap-4 text-primary">
                              <FaEdit
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => showEdit(row.id)}
                              />{" "}
                              <FaXmark
                                onClick={() => {
                                  localStorage.setItem(
                                    "specialityId",
                                    row.id.toString()
                                  );
                                  setCancel(true);
                                }}
                                className="hover:cursor-pointer hover:opacity-70"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {add ? (
                <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                  <h4 className="text-primary text-xl mb-4 text-center">
                    Agregar especialidad
                  </h4>
                  <form
                    className="flex gap-4"
                    onSubmit={addSpeciality.handleSubmit}
                  >
                    <Input
                      placeholder="Nombre"
                      type="text"
                      name="name"
                      onChange={addSpeciality.handleChange}
                      onBlur={addSpeciality.handleBlur}
                    />
                    <Button onClick={() => setConfirm(true)}>Agregar</Button>
                  </form>
                </div>
              ) : (
                ""
              )}
              {edit ? (
                <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                  <h4 className="text-primary text-xl mb-4 text-center">
                    Editar especialidad
                  </h4>
                  <form
                    className="flex gap-4"
                    onSubmit={editSpeciality.handleSubmit}
                  >
                    <Input
                      placeholder="Nombre"
                      type="text"
                      name="name"
                      onChange={editSpeciality.handleChange}
                      onBlur={editSpeciality.handleBlur}
                      value={editSpeciality.values.name}
                    />
                    <Button onClick={() => setUpdate(true)}>Editar</Button>
                  </form>
                </div>
              ) : (
                ""
              )}
            </section>
          </div>
        </div>
        <Dialog
          open={confirm || update || cancel}
          onClose={() => {
            setConfirm(false);
            setUpdate(false);
            setCancel(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="text-center">
            {confirm ? "Especialidad" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea agregar la especialidad?"
                : update
                ? "¿Desea actualizar los datos?"
                : cancel
                ? "¿Desea eliminar la especialidad?"
                : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="text"
              onClick={() => {
                setConfirm(false);
                setUpdate(false);
                setCancel(false);
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
          open={error || success}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={4000}
          onClose={() => {
            setError(false);
            setSuccess(false);
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={error ? "error" : "success"}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuth(
  async (auth: Auth | null, context: any) => {
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
