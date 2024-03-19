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
import { robotoBold } from "@/lib/fonts";
import { BenefitResponseDto } from "@/components/dto/benefit.dto";
import { PlanResponseDto } from "@/components/dto/plan.dto";

interface Benefit {
  auth: Auth;
  benefits: BenefitResponseDto[];
}

export default function Home(props: Benefit) {
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
  const [benefit, setBenefit] = useState<any>();

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

      addBenefit.values.name = "";

      setConfirm(false);
      setAdd(false);

      setMessage("Benefit agregado correctamente!");
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

      setUpdate(false);
      setEdit(false);

      setMessage("Benefit editada correctamente!");
      setSuccess(true);
      router.push(`/admin/benefits`);
    },
  });

  const deleteBenefit = async () => {
    const id = localStorage.getItem("benefitId");
    console.log(id);
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/benefit/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${props.auth.token}` },
    });

    setUpdate(false);
    setEdit(false);
    setCancel(false);
    setBenefit(null);

    setMessage("Benefit eliminado correctamente!");
    setSuccess(true);
    router.push(`/admin/benefits`);
  };

  const onConfirmClick = () => {
    if (addBenefit.values.name.length > 0) {
      addBenefit.handleSubmit();
    } else if (cancel) {
      deleteBenefit();
    } else {
      editBenefit.handleSubmit();
    }
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
          <div className="bg-white p-4 w-full h-full">
            <section className="w-full rounded-md flex flex-col items-center relative">
              <div className="w-5/6">
                <div className="flex justify-end">
                  <Button
                    startIcon={<FaPlus />}
                    onClick={() => {
                      setEdit(false);
                      setAdd(true);
                      setBenefit(null);
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
                          Operaciones
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.benefits.map((row) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell align="center">
                            {row.id}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.name}
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
                                    "benefitId",
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
                    className="flex gap-4"
                    onSubmit={addBenefit.handleSubmit}
                  >
                    <Input
                      placeholder="Nombre"
                      type="text"
                      name="name"
                      onChange={addBenefit.handleChange}
                      onBlur={addBenefit.handleBlur}
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
                    Editar benefit
                  </h4>
                  <form
                    className="flex gap-4"
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
            {confirm ? "Benefit" : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm
                ? "¿Desea agregar el benefit?"
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
