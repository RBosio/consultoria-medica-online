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
import {
  FaAngleRight,
  FaCheck,
  FaCircleInfo,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { PlanResponseDto } from "@/components/dto/plan.dto";
import { robotoBold } from "@/lib/fonts";

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
  const [plan, setPlan] = useState<PlanResponseDto>();

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
      discount: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      values.discount = values.discount / 100;

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/plan`, values, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${props.auth.token}` },
      });

      addPlan.values.name = "";

      setConfirm(false);
      setAdd(false);

      setMessage("Obra social agregada correctamente!");
      setSuccess(true);
      router.push(`/admin/plans`);
    },
  });

  const editPlan = useFormik({
    initialValues: {
      id: 0,
      name: "",
      discount: 0,
    },
    onSubmit: async (values, { setSubmitting }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/plan/${values.id}`,
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
      router.push(`/admin/plans`);
    },
  });

  const onConfirmClick = () => {
    if (addPlan.values.name.length > 0) {
      addPlan.handleSubmit();
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

    // editPlan.setValues({
    //   id: p.data.id,
    //   name: p.data.name,
    //   discount: p.data.discount * 100,
    // });

    // setEdit(true);
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
                            <FaXmark className="hover:cursor-pointer hover:opacity-70" />
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
                  <h4 className="text-primary text-xl text-center underline">
                    Beneficios
                  </h4>
                  <FaXmark className="text-primary text-2xl hover:cursor-pointer hover:opacity-70 absolute top-4 right-4" onClick={() => setPlan(null)}/>
                  <div className="flex justify-center">
                    <div>
                      {plan.benefits.map((b) => {
                        return (
                          <div
                            className="flex justify-between items-center gap-2 text-white bg-secondary p-4 rounded-md m-2"
                            key={b.id}
                          >
                            <div className="flex items-center gap-2">
                              <FaAngleRight /> <p>{b.name}</p>
                            </div>
                            <FaXmark className="ml-4 hover:cursor-pointer hover:opacity-70" />
                          </div>
                        );
                      })}
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
                  Agregar obra social
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
                    name="discount"
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
                  Editar obra social
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
                    name="discount"
                    onChange={editPlan.handleChange}
                    onBlur={editPlan.handleBlur}
                    value={editPlan.values.discount}
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
            {confirm ? "Obra social" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea agregar la obra social?"
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
