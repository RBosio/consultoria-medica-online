import React, { useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../../shared/types";
import axios from "axios";
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
import { FaAngleRight, FaCircleInfo, FaPlus, FaXmark } from "react-icons/fa6";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { robotoBold } from "@/lib/fonts";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";

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

      setConfirm(false);
      setAdd(false);

      setMessage("Plan agregado correctamente!");
      setSuccess(true);
      router.push(`/admin/plans`);
    },
  });

  const editPlan = useFormik({
    initialValues: {
      id: 0,
      name: "",
      price: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
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

      setMessage("Plan editada correctamente!");
      setSuccess(true);
      router.push(`/admin/plans`);
    },
  });

  const deletePlan = async () => {
    const id = localStorage.getItem("planId");
    console.log(id);
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
    if (addPlan.values.name.length > 0) {
      addPlan.handleSubmit();
    } else if (cancel) {
      deletePlan();
    } else {
      editPlan.handleSubmit();
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
  };

  return (
    <Layout auth={props.auth}>
      <div className="flex justify-center items-center">
        <div className="flex flex-col md:flex-row items-center gap-4 w-[90%] mt-12">
          <SidebarAdmin
            auth={props.auth}
            setSidebarOpened={true}
            sidebarOpened
          />
          <div className="bg-white p-4 w-full">
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
                        <StyledTableCell align="center">Precio</StyledTableCell>
                        <StyledTableCell align="center">
                          Operaciones
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.plans.map((row) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell align="center">
                            {row.id}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            $ {row.price}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <div className="flex justify-center items-center gap-4">
                              <FaCircleInfo
                                className="hover:cursor-pointer hover:opacity-70"
                                onClick={() => showDetail(row.id)}
                              />{" "}
                              <FaXmark
                                onClick={() => {
                                  localStorage.setItem(
                                    "planId",
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
              <div>
                {plan ? (
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
                    <h4 className="text-primary text-xl text-center underline mt-8">
                      Beneficios
                    </h4>
                    <div className="flex justify-center">
                      <div>
                        {plan.benefits.length === 0 ? (
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
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {add ? (
                <div className="absolute bg-white bottom-10 p-8 border border-primary rounded-md shadow-md">
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
              ) : (
                ""
              )}
              {edit ? (
                <div className="absolute bg-white bottom-10 p-8 border border-primary rounded-md shadow-md">
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
  true
);
