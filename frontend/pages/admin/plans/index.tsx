import React, { useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
import {
  Alert,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import { FaAngleRight, FaCircleInfo, FaPlus, FaXmark } from "react-icons/fa6";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { robotoBold } from "@/lib/fonts";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";
import { PRIMARY_COLOR } from "@/constants";
import { FaEdit } from "react-icons/fa";

interface Plan {
  auth: Auth;
  plans: PlanResponseDto[];
}

export default function Home(props: Plan) {
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
  const [plan, setPlan] = useState<any>();
  const [planId, setPlanId] = useState<any>();
  const [planUpdate, setPlanUpdate] = useState<any>();
  const [addBenefits, setAddBenefits] = useState<any>();
  const [benefits, setBenefits] = useState<any>();
  const [checkeds, setCheckeds] = useState<number[]>([]);
  const [o, setO] = useState<boolean>(false);

  const addPlan = useFormik({
    initialValues: {
      name: "",
      price: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/plan`, values, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      });

      addPlan.values.name = "";
      addPlan.values.price = 0;

      setPlan(null);
      setPlanUpdate(null);

      setConfirm(false);
      setAdd(false);

      setMessage("Plan agregado correctamente!");
      setSuccess(true);

      setTimeout(() => {
        router.push(`/admin/plans`);
      }, 2000);
    },
  });

  const editPlan = useFormik({
    initialValues: {
      id: 0,
      name: "",
      price: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      values.id = planId;

      if (!values.price || values.price <= 0) {
        setMessage("El precio debe ser positivo");
        setError(true);
        setUpdate(false);
        setEdit(false);

        return;
      }

      if (!values.name || values.name.length === 0) {
        setMessage("Ingrese el nombre del plan");
        setError(true);
        setUpdate(false);
        setEdit(false);

        return;
      }
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/plan/${values.id}`,
        { name: values.name, price: values.price },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${props.auth.token}` },
        }
      );

      setUpdate(false);
      setEdit(false);

      addPlan.values.name = "";
      addPlan.values.price = 0;

      setMessage("Plan editada correctamente!");
      setSuccess(true);

      router.push(`/admin/plans`);
    },
  });

  const deletePlan = async () => {
    const id = localStorage.getItem("planId");
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/plan/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${props.auth.token}` },
    });

    setUpdate(false);
    setEdit(false);
    setCancel(false);

    setMessage("Plan eliminado correctamente!");
    setSuccess(true);
    router.push(`/admin/plans`);
  };

  const onConfirmClick = () => {
    if (add && addPlan.values.name.length === 0) {
      setError(true);
      setMessage("Por favor, complete todos los campos!");

      setConfirm(false);
      setO(false);
      return;
    }
    if (add && addPlan.values.price <= 0) {
      setError(true);
      setMessage("Por favor, ingrese un precio válido!");
      setConfirm(false);
      setO(false);
      return;
    }
    if (addPlan.values.name.length > 0) {
      addPlan.handleSubmit();
      setO(false);
    } else if (cancel) {
      deletePlan();
      setO(false);
    } else if (update) {
      editPlan.handleSubmit();
      setO(false);
    } else {
      setConfirm(false);
      setAdd(false);
      setEdit(false);
      setUpdate(false);
      setO(false);
    }
  };

  const showDetail = async (id: number) => {
    setAdd(false);
    setEdit(false);
    const p = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${props.auth.token}` },
    });

    setPlan(p.data);
    setPlanUpdate(p.data);
    setCheckeds(p.data.benefits.map((b: BenefitResponseDto) => b.id));
    setO(true);
  };

  const addBenefitsPlan = async () => {
    let benefits = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/benefit`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    benefits = benefits.data;
    setBenefits(benefits);

    setAddBenefits(true);
  };

  const checkboxOnChange = (e: any) => {
    if (e.target.checked) {
      const checked = checkeds.concat(Number(e.target.name));
      setCheckeds(checked);
    } else {
      const checked = checkeds.filter((c) => c !== Number(e.target.name));
      setCheckeds(checked);
    }
  };

  const handleSubmitBenefits = async (e: any) => {
    e.preventDefault();

    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/plan/${plan.id}/benefits`,
      {
        ben: checkeds.map((c) => ({
          id: c,
        })),
      },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      }
    );

    setMessage("Beneficios modificados con éxito!");
    setSuccess(true);

    setAddBenefits(false);
    setPlan(null);
    setO(false);
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center items-start">
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
                <div className="flex justify-end gap-4">
                  <Button
                    startIcon={<FaPlus />}
                    onClick={() => {
                      setEdit(false);
                      setAdd(true);
                      setO(true);
                      setPlan(null);
                      setPlanUpdate(null);
                    }}
                  >
                    Agregar
                  </Button>
                </div>
                <TableContainer component={Paper} className="mt-4">
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
                          Precio
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
                      {props.plans.map((row) => (
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
                            $ {row.price}
                          </TableCell>
                          <TableCell
                            className="text-sm"
                            align="center"
                            sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                          >
                            <div className="flex justify-center items-center gap-4 text-primary">
                              <FaCircleInfo
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => showDetail(row.id)}
                              />{" "}
                              <FaEdit
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => {
                                  setEdit(true);
                                  setAdd(false);
                                  setO(true);
                                  setPlan(false);
                                  setPlanId(row.id);
                                }}
                              />{" "}
                              <FaXmark
                                onClick={() => {
                                  setAdd(false);
                                  localStorage.setItem(
                                    "planId",
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
              <div>
              </div>
            </section>
          </div>
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
                      id="modal-modal-description"
                      component={"span"}
                      variant={"body2"}
                      sx={{ mt: 2 }}
                    >
                      {add && (
                        <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                        <h4 className="text-primary text-xl mb-4 text-center">
                          Agregar plan
                        </h4>
                        <form className="flex gap-4" onSubmit={addPlan.handleSubmit}>
                          <Input
                            placeholder="Nombre"
                            type="text"
                            name="name"
                            onChange={addPlan.handleChange}
                            onBlur={addPlan.handleBlur}
                          />
                          <Input
                            placeholder="Precio"
                            type="number"
                            name="price"
                            onChange={addPlan.handleChange}
                            onBlur={addPlan.handleBlur}
                          />
                          <Button onClick={() => setConfirm(true)}>Agregar</Button>
                        </form>
                      </div>
                      )}
                      {edit && (
                        <div className="bg-white p-8 border border-primary rounded-md shadow-md mt-12">
                        <h4 className="text-primary text-xl mb-4 text-center">
                          Editar plan
                        </h4>
                        <form className="flex gap-4" onSubmit={editPlan.handleSubmit}>
                          <Input
                            placeholder="Nombre"
                            type="text"
                            name="name"
                            onChange={editPlan.handleChange}
                            onBlur={editPlan.handleBlur}
                            value={editPlan.values.name}
                          />
                          <Input
                            placeholder="Precio"
                            type="number"
                            name="price"
                            onChange={editPlan.handleChange}
                            onBlur={editPlan.handleBlur}
                            value={editPlan.values.price}
                          />
                          <Button onClick={() => setUpdate(true)}>Editar</Button>
                        </form>
                      </div>
                      )}
                      {plan && (
                        <div className="p-2 m-4 relative">
                        <h4
                          className={`text-primary text-3xl text-center ${robotoBold.className}`}
                        >
                          {plan.name}
                        </h4>
                        <h3
                          className={`text-secondary text-md text-center ${robotoBold.className} font-normal`}
                        >
                          $ {plan.price}
                        </h3>
                        <div className="text-primary text-xl flex justify-center items-center gap-4 mt-8">
                          <h4 className="text-center underline">Beneficios</h4>
                          <div
                            className="hover:cursor-pointer hover:opacity-70"
                            onClick={addBenefitsPlan}
                          >
                            <FaPlus />
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="md:flex md:justify-center md:items-center md:flex-wrap">
                            {!addBenefits ? (
                              plan.benefits.length === 0 ? (
                                <div className="bg-secondary text-white font-semibold p-4 rounded-lg mt-4">
                                  Actualmente no se encuentran beneficios para este
                                  plan!
                                </div>
                              ) : (
                                plan.benefits.map((b: BenefitResponseDto) => {
                                  return (
                                    <div
                                      className="flex justify-between items-center gap-2 text-white bg-secondary p-4 rounded-md m-2"
                                      key={b.id}
                                    >
                                      <div className="flex items-center gap-2">
                                        <FaAngleRight /> <p>{b.name}</p>
                                      </div>
                                    </div>
                                  );
                                })
                              )
                            ) : (
                              <form
                                onSubmit={handleSubmitBenefits}
                                className="flex flex-col"
                              >
                                {benefits.map((b: BenefitResponseDto) => (
                                  <div
                                    key={b.id}
                                    className="flex justify-center items-center gap-2 mx-4"
                                  >
                                    <FormControl component="fieldset">
                                      <div className="flex items-center gap-4">
                                        {b.name}
    
                                        <FormGroup aria-label="position" row>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name={b.id.toString()}
                                                onChange={checkboxOnChange}
                                                checked={checkeds.includes(b.id)}
                                              />
                                            }
                                            label=""
                                            labelPlacement="end"
                                          />
                                        </FormGroup>
                                      </div>
                                    </FormControl>
                                  </div>
                                ))}
                                <Button type="submit">Aceptar</Button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                      )}
                    </Typography>
                  </Box>
                </Fade>
              </Modal>
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
            {confirm ? "Plan" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea agregar el plan?"
                : update
                ? "¿Desea actualizar los datos?"
                : cancel
                ? "¿Desea eliminar el plan?"
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

    let plans = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plan`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${context.req.cookies.token}` },
    });

    plans = plans.data;

    return {
      props: {
        auth,
        plans,
      },
    };
  },
  { protected: true }
);
