import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import SidebarAdmin from "@/components/sidebarAdmin";
import { Auth } from "../../../shared/types";
import axios from "axios";
import { SpecialityResponseDto } from "@/components/dto/speciality.dto";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fade,
    IconButton,
    Modal,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import {
    FaBriefcaseMedical,
    FaChevronLeft,
    FaChevronRight,
    FaCircleInfo,
    FaClock,
    FaFile,
    FaSort,
    FaUserDoctor,
    FaXmark,
} from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { PRIMARY_COLOR } from "@/constants";
import { UserResponseDto } from "@/components/dto/user.dto";
import Link from "next/link";
import Button from "@/components/button";
import Input from "@/components/input";
import Avatar from "@/components/avatar";
import { IoIosCloseCircleOutline, IoMdMail } from "react-icons/io";
import { FaHome, FaPhoneAlt, FaUser } from "react-icons/fa";
import { BsCurrencyDollar, BsFillCreditCard2FrontFill } from "react-icons/bs";
import { MdHealthAndSafety } from "react-icons/md";
import { pesos } from "@/lib/formatCurrency";
import { CiMedicalClipboard } from "react-icons/ci";

interface Speciality {
    auth: Auth;
    users: UserResponseDto[];
}

interface UserResponseDtoExt extends UserResponseDto {
    province: string,
    cityStr: string,
};

export default function Home(props: Speciality) {
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<UserResponseDtoExt | null>();
    const [users, setUsers] = useState<any[]>([]);
    const [usersFiltered, setUsersFiltered] = useState<any[]>([]);
    const [page, setPage] = useState<any>();
    const [o, setO] = useState(false);
    const [verify, setVerify] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [directionName, setDirectionName] = useState<string>("asc");
    const [cityLoading, setCityLoading] = useState(false);

    const theme = useTheme();

    console.log(user);

    useEffect(() => {
        async function updateDepartment() {
            if (!o || !user?.city) return;
            setCityLoading(true);
            const depReq = await axios.get(
                `https://apis.datos.gob.ar/georef/api/departamentos?id=${user?.city}`
            );
            const data = depReq.data.departamentos[0];
            setUser({ ...user, province: data.provincia.nombre, cityStr: data.nombre });
            setCityLoading(false);
        };
        updateDepartment();
    }, [o]);

    useEffect(() => {
        setPage(1);
        const filter = props.users.filter((sp, idx) => idx >= 10 * 0 && idx < 10);
        setUsers(props.users);
        setUsersFiltered(filter);
    }, []);

    const pagination = (p: number, sp?: SpecialityResponseDto[]) => {
        if (!sp) {
            if (p === 0 || p === Math.ceil(props.users.length / 10) + 1) return;

            setPage(p);
            setUsersFiltered(
                props.users.filter((sp, idx) => idx >= 10 * (p - 1) && idx < 10 * p)
            );
        } else {
            setPage(p);
            setUsersFiltered(
                sp.filter((s, idx) => idx >= 10 * (p - 1) && idx < 10 * p)
            );
        }
    };

    const handleVerification = async (doctorId: number) => {
        await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/doctor/verify/${doctorId}`,
            {},
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${props.auth.token}` },
            }
        );

        setSuccess(true);
        setMessage("Doctor verificado con éxito");

        const userAux = users.filter((u) => u.doctor?.id === doctorId)[0];
        userAux.doctor.verified = true;
        setUsers(props.users.map((u) => (u.doctor?.id === doctorId ? userAux : u)));

        setO(false);
        setVerify(false);

        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/notification`,
            {
                userIdSend: props.auth.id,
                userIdReceive: user!.id,
                type: "verificationDoc",
            },
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${props.auth.token}` },
            }
        );

        await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/clearHI/${user!.id}`,
            {},
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${props.auth.token}` },
            }
        );
    };

    const filterChange = (name: string) => {
        setPage(1);
        setUsersFiltered(
            users.filter((u: UserResponseDto) =>
                u.name
                    .concat(" " + u.surname)
                    .toLowerCase()
                    .includes(name)
            )
        );
    };

    const handleOrderChange = (filter: string) => {
        setName("");
        if (filter === "name") {
            setUsersFiltered(
                usersFiltered.sort((a, b) => {
                    if (directionName === "asc") {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                })
            );
        } else {
            setUsersFiltered(
                usersFiltered.sort((a, b) => {
                    if (directionName === "asc") {
                        return a.surname.localeCompare(b.surname);
                    } else {
                        return b.surname.localeCompare(a.surname);
                    }
                })
            );
        }

        if (directionName === "asc") {
            setDirectionName("desc");
        } else {
            setDirectionName("asc");
        }
    };

    return (
        <Layout auth={props.auth}>
            <div id="scroller" className="flex justify-center">
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
                                {
                                    <div className="flex justify-between items-center py-4">
                                        <Input
                                            name="name"
                                            value={name}
                                            placeholder="Buscar por usuario..."
                                            variant="outlined"
                                            onChange={($e: any) => {
                                                setName($e.target.value.toLowerCase());
                                                filterChange($e.target.value.toLowerCase());
                                            }}
                                            startadornment={
                                                <FaUserDoctor color={theme.palette.primary.main} />
                                            }
                                            className="w-4/12"
                                            label="Usuario"
                                        />
                                        <div className="flex gap-2 text-primary">
                                            <FaChevronLeft
                                                className="text-2xl hover:cursor-pointer"
                                                onClick={() => {
                                                    pagination(page - 1);
                                                    setName("");
                                                }}
                                            />

                                            <FaChevronRight
                                                className="text-2xl hover:cursor-pointer"
                                                onClick={() => {
                                                    pagination(page + 1);
                                                    setName("");
                                                }}
                                            />

                                            <p className="text-md">
                                                Página {page ? page : 1} -
                                                {Math.ceil(props.users.length / 10)}
                                            </p>
                                        </div>

                                    </div>
                                }
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
                                                    <div className="flex items-center">
                                                        <p className="w-3/4">Nombre</p>
                                                        <FaSort
                                                            className="hover:cursor-pointer"
                                                            onClick={() => handleOrderChange("name")}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        color: "#fff",
                                                        padding: "1.2rem",
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    <div className="flex items-center">
                                                        <p className="w-3/4">Apellido</p>
                                                        <FaSort
                                                            className="hover:cursor-pointer"
                                                            onClick={() => handleOrderChange("surname")}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        color: "#fff",
                                                        padding: "1.2rem",
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    Rol
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        color: "#fff",
                                                        padding: "1.2rem",
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    Obras sociales
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
                                            {usersFiltered.map((row) => (
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
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-sm"
                                                        align="center"
                                                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                                                    >
                                                        {row.surname}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-sm"
                                                        align="center"
                                                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                                                    >
                                                        {row.doctor ? "Doctor" : "Paciente"}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-sm"
                                                        align="center"
                                                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                                                    >
                                                        <div className="flex justify-center items-center gap-2">
                                                            {row.healthInsurances.length > 0 ? row.healthInsurances?.map((hi: any) => hi.healthInsurance.name).join(", ") : '-'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-sm"
                                                        align="center"
                                                        sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                                                    >
                                                        <div className="flex justify-center items-center">
                                                            <FaCircleInfo
                                                                className="text-primary hover:cursor-pointer size-4"
                                                                onClick={() => {
                                                                    setUser(row);
                                                                    setO(true);
                                                                }}
                                                            />
                                                            {row?.doctor ? (
                                                                <>
                                                                    {row?.doctor.verified ? (
                                                                        <Tooltip title="Verificado">
                                                                            <IconButton>
                                                                                <FaCheck className="text-green-600 size-4" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip title="No verificado">
                                                                            <IconButton>
                                                                                <FaXmark className="text-red-600 size-4" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
                                            <div className="flex items-center justify-center gap-4">
                                                {user?.image && <Avatar
                                                    labelProps={{
                                                        className: "hidden",
                                                    }}
                                                    name={user?.name ?? ''}
                                                    surname={user?.surname ?? ''}
                                                    className="bg-white"
                                                    size={70}
                                                    photo={user?.image ? user.image : undefined}
                                                />}
                                                <Typography
                                                    variant="h6"
                                                    component="h2"
                                                    className="text-center text-primary text-2xl"
                                                >
                                                    {user?.name} {user?.surname}
                                                </Typography>
                                            </div>
                                            <Typography
                                                id="modal-modal-description"
                                                component={"span"}
                                                variant={"body2"}
                                                sx={{ mt: 2 }}
                                            >
                                                {user && (
                                                    <div
                                                        className={`p-4 mx-auto ${!user?.doctor && "flex flex-col items-center"
                                                            }`}
                                                    >
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="text-primary text-xl py-2 flex gap-2 items-center">
                                                                    <FaUser size={18} />
                                                                    <h3>Datos personales</h3>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center text-primary text-[16px] gap-1">
                                                                        <IoMdMail />
                                                                        Email:
                                                                    </div>
                                                                    {user.email}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center text-primary text-[16px] gap-1">
                                                                        <FaHome />
                                                                        Dirección:
                                                                    </div>
                                                                    {cityLoading ? <CircularProgress size={15}/> : user.address ? `${user.address} - ${user.cityStr}, ${user.province}` : '-'}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center text-primary text-[16px] gap-1">
                                                                        <FaPhoneAlt />
                                                                        Teléfono:
                                                                    </div>
                                                                    {user.phone || "-"}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center text-primary text-[16px] gap-1">
                                                                        <BsFillCreditCard2FrontFill />
                                                                        DNI:
                                                                    </div>
                                                                    {user.dni}
                                                                </div>
                                                                {!user.doctor && <div className="flex items-center gap-2">
                                                                    <div className="flex items-center text-primary text-[16px] gap-1">
                                                                        <MdHealthAndSafety />
                                                                        Obras Sociales:
                                                                    </div>
                                                                    {
                                                                        user.healthInsurances.length > 0 ? user.healthInsurances?.map((hi) => hi.healthInsurance.name).join(", ") : '-'
                                                                    }
                                                                </div>}
                                                            </div>
                                                            {user?.doctor && (
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="text-primary text-xl py-2 flex gap-2 items-center">
                                                                        <FaBriefcaseMedical size={18} />
                                                                        <h3>Datos del profesional</h3>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Chip color={user.doctor?.verified ? "primary" : "error"}
                                                                            className="text-white p-2"
                                                                            icon={user.doctor?.verified ? <FaCheck /> : <IoIosCloseCircleOutline size={20}/>}
                                                                            label={user.doctor?.verified ? "Verificado" : "No verificado"} />
                                                                        {!user.doctor?.verified && <Button
                                                                            variant="text"
                                                                            onClick={() => {
                                                                                setVerify(true);
                                                                            }}
                                                                        >
                                                                            Verificar profesional
                                                                        </Button>}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center text-primary text-[16px] gap-1">
                                                                            <FaFile />
                                                                            Archivos:
                                                                        </div>
                                                                        {user.doctor?.registration && (
                                                                            <Link
                                                                                target="_blank"
                                                                                href={`http://localhost:3000/uploads/doctor/registration/${user.doctor.registration}`}
                                                                                className="flex justify-center gap-2 text-sm text-cyan-600 hover:underline"
                                                                            >
                                                                                Matrícula profesional
                                                                            </Link>
                                                                        )}
                                                                        {user.doctor?.title && (
                                                                            <Link
                                                                                target="_blank"
                                                                                href={`http://localhost:3000/uploads/doctor/title/${user.doctor.title}`}
                                                                                className="flex justify-center gap-2 text-sm text-cyan-600 hover:underline"
                                                                            >
                                                                                Título universitario
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center text-primary text-[16px] gap-1">
                                                                            <FaClock />
                                                                            Duración de reuniones:
                                                                        </div>
                                                                        {user.doctor?.durationMeeting ? `${user.doctor?.durationMeeting} min` : '-'}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center text-primary text-[16px] gap-1">
                                                                            <BsCurrencyDollar />
                                                                            Costo de reuniones:
                                                                        </div>
                                                                        {user.doctor?.priceMeeting ? pesos.format(user.doctor.priceMeeting) : '-'}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center text-primary text-[16px] gap-1">
                                                                            <CiMedicalClipboard size={18} />
                                                                            Especialidades:
                                                                        </div>
                                                                        {user.doctor?.specialities
                                                                            .map((s) => s.name)
                                                                            .join(", ")}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center text-primary text-[16px] gap-1">
                                                                            <MdHealthAndSafety />
                                                                            Obras Sociales:
                                                                        </div>
                                                                        {
                                                                            user.healthInsurances.length > 0 ? user.healthInsurances?.map((hi) => hi.healthInsurance.name).join(", ") : '-'
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                )}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                </Modal>
                            </div>
                        </section>
                    </div>
                </div>
                <Dialog
                    open={verify}
                    onClose={() => {
                        setVerify(false);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="text-center">
                        Validar doctor
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Desea verificar al doctor?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="error"
                            variant="text"
                            onClick={() => {
                                setVerify(false);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={() => handleVerification(user?.doctor?.id ?? 0)} autoFocus>
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

        let users = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${context.req.cookies.token}` },
        });

        users = users.data;

        return {
            props: {
                auth,
                users,
            },
        };
    },
    { protected: true }
);
