import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
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
  styled,
  tableCellClasses,
  useTheme,
} from "@mui/material";
import {
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
  FaCircleInfo,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { robotoBold } from "@/lib/fonts";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { PRIMARY_COLOR } from "@/constants";

interface Benefit {
  auth: Auth;
  benefits: BenefitResponseDto[];
}

export default function Home(props: Benefit) {
  const router = useRouter();

  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [cancel, setCancel] = useState<boolean>(false);
  const [benefit, setBenefit] = useState<any>();
  const [benefits, setSpecialities] = useState<any[]>([]);
  const [page, setPage] = useState<any>();
  const [o, setO] = useState(false);

  useEffect(() => {
    setPage(1);
    setSpecialities(
      props.benefits.filter((sp, idx) => idx >= 4 * 0 && idx < 4)
    );
  }, []);

  const pagination = (p: number, sp?: BenefitResponseDto[]) => {
    if (!sp) {
      if (p === 0 || p === Math.ceil(props.benefits.length / 4) + 1) return;

      setPage(p);
      setSpecialities(
        props.benefits.filter((sp, idx) => idx >= 4 * (p - 1) && idx < 4 * p)
      );
    } else {
      setPage(p);
      setSpecialities(sp.filter((s, idx) => idx >= 4 * (p - 1) && idx < 4 * p));
    }
  };

  const addBenefit = useFormik({
    initialValues: {
      name: "",
      price: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/benefit`, values, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      });

      let benefits = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/benefit`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      addBenefit.values.name = "";

      setConfirm(false);
      setAdd(false);
      setO(false);

      setSpecialities(benefits.data);
      pagination(page, benefits.data);

      setMessage("Beneficio agregado correctamente!");
      setSuccess(true);
      router.push(`/admin/benefits`);
    },
  });

  const editBenefit = useFormik({
    initialValues: {
      id: 0,
      name: "",
      price: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/benefit/${values.id}`,
        { name: values.name, price: values.price },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      let benefits = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/benefit`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setUpdate(false);
      setEdit(false);
      setO(false);

      setMessage("Beneficio editada correctamente!");
      setSuccess(true);

      setSpecialities(benefits.data);
      pagination(page, benefits.data);

      router.push(`/admin/benefits`);
    },
  });

  const deleteBenefit = async () => {
    const id = localStorage.getItem("benefitId");
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/benefit/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${props.auth.token}` },
    });

    setUpdate(false);
    setEdit(false);
    setCancel(false);
    setBenefit(null);

    setMessage("Beneficio eliminado correctamente!");
    setSuccess(true);

    setSpecialities(props.benefits.filter((sp) => sp.id != Number(id)));
    pagination(
      page,
      props.benefits.filter((sp) => sp.id != Number(id))
    );

    router.push(`/admin/benefits`);
  };

  const onConfirmClick = () => {
    if (confirm) {
      if (addBenefit.values.name.length > 0) {
        addBenefit.handleSubmit();
      } else {
        setError(true);
        setMessage("El nombre es requerido!");
        setConfirm(false);
        return;
      }
    }

    if (cancel) {
      deleteBenefit();
    } else if (editBenefit.values.name.length > 0) {
      editBenefit.handleSubmit();
    }

    setConfirm(false);
    setAdd(false);
    setEdit(false);
    setO(false);
  };

  const showDetail = async (id: number) => {
    setAdd(false);
    setEdit(false);
    const p = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/benefit/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setBenefit(p.data);
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
                      setBenefit(null);
                      setO(true);
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
                    Página {page ? page : 1} -{" "}
                    {Math.ceil(props.benefits.length / 4)}
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
                      {benefits.map((row) => (
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
                              <FaCircleInfo
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => {
                                  showDetail(row.id);
                                  setO(true);
                                }}
                              />{" "}
                              <FaXmark
                                onClick={() => {
                                  localStorage.setItem(
                                    "benefitId",
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
                      Especialidad
                    </Typography>
                    <Typography
                      id="modal-modal-description"
                      component={"span"}
                      variant={"body2"}
                      sx={{ mt: 2 }}
                    >
                      <div>
                        {benefit ? (
                          <div className="p-2 m-4 relative">
                            <h4
                              className={`text-primary text-3xl text-center ${robotoBold.className}`}
                            >
                              {benefit.name}
                            </h4>
                            <h4 className="text-primary text-xl text-center underline mt-8">
                              Planes en los que se encuentra el beneficio
                            </h4>
                            <div className="flex justify-center">
                              <div className="md:flex md:justify-center md:items-center md:flex-wrap">
                                {benefit.plans.length === 0 ? (
                                  <div className="bg-secondary text-white font-semibold p-4 rounded-lg mt-4">
                                    Actualmente no se encuentran planes con este
                                    beneficio!
                                  </div>
                                ) : (
                                  benefit.plans.map((p: PlanResponseDto) => {
                                    return (
                                      <div
                                        className="flex justify-between items-center gap-2 text-white bg-secondary p-4 rounded-md m-2"
                                        key={p.id}
                                      >
                                        <div className="flex items-center gap-2">
                                          <FaAngleRight /> <p>{p.name}</p>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {add ? (
                        <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                          <h4 className="text-primary text-xl mb-4 text-center">
                            Agregar beneficio
                          </h4>
                          <form
                            className="flex flex-col md:flex-row justify-center gap-4"
                            onSubmit={addBenefit.handleSubmit}
                          >
                            <Input
                              placeholder="Nombre"
                              type="text"
                              name="name"
                              onChange={addBenefit.handleChange}
                              onBlur={addBenefit.handleBlur}
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
                            Editar beneficio
                          </h4>
                          <form
                            className="flex justify-center gap-4"
                            onSubmit={editBenefit.handleSubmit}
                          >
                            <Input
                              placeholder="Nombre"
                              type="text"
                              name="name"
                              onChange={editBenefit.handleChange}
                              onBlur={editBenefit.handleBlur}
                              value={editBenefit.values.name}
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
            {confirm ? "Beneficio" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea agregar el beneficio?"
                : update
                ? "¿Desea actualizar los datos?"
                : cancel
                ? "¿Desea eliminar el beneficio?"
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
    let benefits = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/benefit`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${context.req.cookies.token}` },
      }
    );

    benefits = benefits.data;

    return {
      props: {
        auth,
        benefits,
      },
    };
  },
  { protected: true }
);
