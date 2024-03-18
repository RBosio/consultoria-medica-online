import React, { useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import { HealthInsuranceResponseDto } from "@/components/dto/healthInsurance.dto";
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
import { FaPlus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";

interface HealthInsurance {
  auth: Auth;
  healthInsurances: HealthInsuranceResponseDto[];
}

export default function Home(props: HealthInsurance) {
  const theme = useTheme();
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [cancel, setCancel] = useState<boolean>(false);

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

  const addHealthInsurance = useFormik({
    initialValues: {
      name: "",
      discount: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      values.discount = values.discount / 100;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
        values,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      addHealthInsurance.values.name = "";

      setConfirm(false);
      setAdd(false);

      setMessage("Obra social agregada correctamente!");
      setSuccess(true);
      router.push(`/admin/health-insurances`);
    },
  });

  const editHealthInsurance = useFormik({
    initialValues: {
      id: 0,
      name: "",
      discount: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance/${values.id}`,
        { name: values.name, discount: values.discount / 100 },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setUpdate(false);
      setEdit(false);

      setMessage("Obra social editada correctamente!");
      setSuccess(true);
      router.push(`/admin/health-insurances`);
    },
  });

  const deleteHealthInsurance = async () => {
    const id = localStorage.getItem("healthInsuranceId");
    console.log(id);
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setUpdate(false);
    setEdit(false);
    setCancel(false);

    setMessage("Obra social eliminada correctamente!");
    setSuccess(true);
    router.push(`/admin/health-insurances`);
  };

  const onConfirmClick = () => {
    if (addHealthInsurance.values.name.length > 0) {
      addHealthInsurance.handleSubmit();
    } else if (cancel) {
      deleteHealthInsurance();
    } else {
      editHealthInsurance.handleSubmit();
    }
  };

  const showEdit = async (id: number) => {
    setAdd(false);
    setEdit(false);
    const hi = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    editHealthInsurance.setValues({
      id: hi.data.id,
      name: hi.data.name,
      discount: hi.data.discount * 100,
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
                <TableContainer component={Paper} className="mt-4">
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">#</StyledTableCell>
                        <StyledTableCell align="center">Nombre</StyledTableCell>
                        <StyledTableCell align="center">
                          Descuento
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Operaciones
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.healthInsurances.map((row) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell align="center">
                            {row.id}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.discount * 100} %
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <div className="flex justify-center items-center gap-4">
                              <FaEdit
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => showEdit(row.id)}
                              />{" "}
                              <FaXmark
                                onClick={() => {
                                  localStorage.setItem(
                                    "healthInsuranceId",
                                    row.id.toString()
                                  );
                                  setCancel(true);
                                }}
                                className="hover:cursor-pointer hover:opacity-70"
                              />
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {add ? (
                <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                  <h4 className="text-primary text-xl mb-4 text-center">
                    Agregar obra social
                  </h4>
                  <form
                    className="flex gap-4"
                    onSubmit={addHealthInsurance.handleSubmit}
                  >
                    <Input
                      placeholder="Nombre"
                      type="text"
                      name="name"
                      onChange={addHealthInsurance.handleChange}
                      onBlur={addHealthInsurance.handleBlur}
                    />
                    <Input
                      placeholder="Descuento"
                      type="number"
                      name="discount"
                      onChange={addHealthInsurance.handleChange}
                      onBlur={addHealthInsurance.handleBlur}
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
                    Editar obra social
                  </h4>
                  <form
                    className="flex gap-4"
                    onSubmit={editHealthInsurance.handleSubmit}
                  >
                    <Input
                      placeholder="Nombre"
                      type="text"
                      name="name"
                      onChange={editHealthInsurance.handleChange}
                      onBlur={editHealthInsurance.handleBlur}
                      value={editHealthInsurance.values.name}
                    />
                    <Input
                      placeholder="Descuento"
                      type="number"
                      name="discount"
                      onChange={editHealthInsurance.handleChange}
                      onBlur={editHealthInsurance.handleBlur}
                      value={editHealthInsurance.values.discount}
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
            {confirm ? "Obra social" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea agregar la obra social?"
                : update
                ? "¿Desea actualizar los datos?"
                : cancel
                ? "¿Desea eliminar la obra social?"
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
