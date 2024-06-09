import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import { HealthInsuranceResponseDto } from "@/components/dto/healthInsurance.dto";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { PRIMARY_COLOR } from "@/constants";
import Paginator from "@/components/paginator";

interface HealthInsurance {
  auth: Auth;
  healthInsurances: HealthInsuranceResponseDto[];
  count: number;
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
  const [healthInsurances, setHealthInsurances] = useState<any[]>([]);
  const [page, setPage] = useState<any>();
  const [o, setO] = useState(false);

  useEffect(() => {
    setPage(1);

    if (!router.query.page) {
      router.push("/admin/health-insurances?page=1");
    }

    setHealthInsurances(props.healthInsurances);
  }, []);

  const addHealthInsurance = useFormik({
    initialValues: {
      name: "",
      discount: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (
        values.discount === 0 ||
        values.discount === null ||
        values.discount === undefined ||
        values.name === ""
      ) {
        setMessage("Ingrese todos los campos!");
        setError(true);

        setConfirm(false);
        return;
      } else if (values.discount < 0 || values.discount > 100) {
        setMessage("El descuento debe ser entre 0 y 100!");

        setConfirm(false);
        setError(true);
        return;
      }

      values.discount = values.discount / 100;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
        values,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      let healthInsurances = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      addHealthInsurance.values.name = "";
      addHealthInsurance.values.discount = 0;

      setConfirm(false);
      setAdd(false);
      setO(false);

      setMessage("Obra social agregada correctamente!");
      setSuccess(true);

      setHealthInsurances(healthInsurances.data);
      pagination(page, healthInsurances.data);

      router.push(`/admin/health-insurances?page=${router.query.page}`);
    },
  });

  const editHealthInsurance = useFormik({
    initialValues: {
      id: 0,
      name: "",
      discount: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (
        values.discount === 0 ||
        values.discount === null ||
        values.discount === undefined ||
        values.name === ""
      ) {
        setMessage("Ingrese todos los campos!");
        setError(true);

        setUpdate(false);
        return;
      } else if (values.discount < 0 || values.discount > 100) {
        setMessage("El descuento debe ser entre 0 y 100!");

        setUpdate(false);
        setError(true);
        return;
      }

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance/${values.id}`,
        { name: values.name, discount: values.discount / 100 },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      let healthInsurances = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setUpdate(false);
      setEdit(false);
      setO(false);

      setMessage("Obra social editada correctamente!");
      setSuccess(true);

      setHealthInsurances(healthInsurances.data);
      pagination(page, healthInsurances.data);

      router.push(`/admin/health-insurances?page=${router.query.page}`);
    },
  });

  const deleteHealthInsurance = async () => {
    const id = localStorage.getItem("healthInsuranceId");
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

    setHealthInsurances(
      props.healthInsurances.filter((hi) => hi.id != Number(id))
    );
    pagination(
      page,
      props.healthInsurances.filter((hi) => hi.id != Number(id))
    );

    router.push(`/admin/health-insurances?page=${router.query.page}`);
  };

  const onConfirmClick = () => {
    if (add) {
      addHealthInsurance.handleSubmit();
    } else if (cancel) {
      deleteHealthInsurance();
    } else if (update) {
      editHealthInsurance.handleSubmit();
    } else {
      setConfirm(false);
      setAdd(false);
      setUpdate(false);
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

  const pagination = (p: number, sp?: HealthInsuranceResponseDto[]) => {
    if (!sp) {
      if (p === 0 || p === Math.ceil(props.healthInsurances.length / 4) + 1)
        return;

      setPage(p);
      setHealthInsurances(
        props.healthInsurances.filter(
          (hi, idx) => idx >= 4 * (p - 1) && idx < 4 * p
        )
      );
    } else {
      setPage(p);
      setHealthInsurances(
        sp.filter((s, idx) => idx >= 4 * (p - 1) && idx < 4 * p)
      );
    }
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
          <div className="bg-white p-4 w-full h-full rounded-lg shadow-lg">
            <section className="w-full rounded-md flex flex-col items-center relative">
              <div className="w-5/6">
                <div className="flex justify-end">
                  <Button
                    startIcon={<FaPlus />}
                    onClick={() => {
                      setEdit(false);
                      setAdd(true);
                      setO(true);
                    }}
                  >
                    Agregar
                  </Button>
                </div>
                <div className="my-4">
                  <Paginator
                    pages={Math.ceil(props.count / 10)}
                    route="/admin/health-insurances"
                  ></Paginator>
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
                          Descuento
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
                      {props.healthInsurances.map((row) => (
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
                            {row.discount * 100} %
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            <div className="flex justify-center items-center gap-4 text-primary">
                              <FaEdit
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => {
                                  setO(true);
                                  showEdit(row.id);
                                }}
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <Modal
                open={o}
                onClose={() => setO(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Fade in={o}>
                  <Box
                    sx={{
                      position: "absolute" as "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "background.paper",

                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      className="text-center text-primary text-2xl"
                    >
                      Obra social
                    </Typography>
                    <Typography
                      id="modal-modal-description"
                      component={"span"}
                      variant={"body2"}
                      sx={{ mt: 2 }}
                    >
                      {add ? (
                        <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                          <h4 className="text-primary text-xl mb-4 text-center">
                            Agregar obra social
                          </h4>
                          <form
                            className="flex flex-col md:flex-row justify-center gap-4"
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
                            <Button onClick={() => setConfirm(true)}>
                              Agregar
                            </Button>
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
                            className="flex flex-col md:flex-row justify-center gap-4"
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
                            <Button onClick={() => setUpdate(true)}>
                              Editar
                            </Button>
                          </form>
                        </div>
                      ) : (
                        ""
                      )}
                    </Typography>
                  </Box>
                </Fade>
              </Modal>
            </section>
          </div>
        </div>
        <Dialog
          open={confirm || update || cancel}
          onClose={() => {
            setConfirm(false);
            setUpdate(false);
            setCancel(false);
            setO(false);
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
    if (auth!.role !== "admin") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { page } = context.query;
    let healthInsurances = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance?page=${page}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    healthInsurances = healthInsurances.data;

    let count = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance/count`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    count = count.data;

    return {
      props: {
        auth,
        healthInsurances,
        count,
      },
    };
  },
  { protected: true }
);
