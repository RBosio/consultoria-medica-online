import React, { useState } from "react";
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
  styled,
  tableCellClasses,
  useTheme,
} from "@mui/material";
import { FaCheck, FaPlus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";

interface Speciality {
  auth: Auth;
  specialities: SpecialityResponseDto[];
}

export default function Home(props: Speciality) {
  const theme = useTheme();
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      color: theme.palette.common.white,
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.secondary.main,
    },
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.secondary.light,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

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

      setConfirm(false);
      setAdd(false);

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

      setUpdate(false);
      setEdit(false);

      setMessage("Especialidad editada correctamente!");
      setSuccess(true);
      router.push(`/admin/specialities`);
    },
  });

  const onConfirmClick = () => {
    if (addSpeciality.values.name.length > 0) {
      addSpeciality.handleSubmit();
    } else {
      editSpeciality.handleSubmit();
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
      name: sp.data.name
    });

    setEdit(true);
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center h-full gap-4 w-[90%]">
          <SidebarAdmin
            auth={props.auth}
            setSidebarOpened={true}
            sidebarOpened
          />
          <section className="w-full h-[calc(100%-5rem)] bg-white rounded-md flex flex-col items-center relative">
            <div className="w-5/6 mt-12">
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
              <TableContainer component={Paper} className="mt-10">
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">#</StyledTableCell>
                      <StyledTableCell align="center">Nombre</StyledTableCell>
                      <StyledTableCell align="center">
                        Operaciones
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.specialities.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell align="center">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div className="flex justify-center items-center gap-4">
                            <FaEdit
                              className="hover:cursor-pointer hover:opacity-70"
                              onClick={() => showEdit(row.id)}
                            />{" "}
                            <FaXmark className="hover:cursor-pointer hover:opacity-70" />
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {add ? (
              <div className="absolute bg-white bottom-10 p-8 border border-primary rounded-md shadow-md">
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
              <div className="absolute bg-white bottom-10 p-8 border border-primary rounded-md shadow-md">
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
        <Dialog
          open={confirm || update}
          onClose={() => {
            setConfirm(false);
            setUpdate(false);
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
  true
);
