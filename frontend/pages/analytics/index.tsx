import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import { Auth } from "../../../shared/types";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { HiDocumentReport } from "react-icons/hi";
import { TfiStatsUp } from "react-icons/tfi";
import { Autocomplete, Box, Checkbox, Fade, Link, Modal, Typography, useTheme } from "@mui/material";
import { robotoBold, roboto } from "@/lib/fonts";
import Input from "@/components/input";
import Chart, { ChartTypeRegistry } from "chart.js/auto";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import DatePicker from "@/components/dateInput";
import Button from "@/components/button";
import dayjs, { Dayjs } from "dayjs";

interface AnalyticsProps {
    auth: Auth,
}

interface Report {
    id: string,
    name: string;
    description: string;
    path: string;
    input_needed: boolean;
    roles: ('doctor' | 'admin')[]
}

export default function Analytics(props: AnalyticsProps) {

    const [tab, setTab] = useState<number>(0);
    const theme = useTheme();

    return (
        <Layout auth={props.auth}>
            <section className="h-full flex items-center justify-center md:p-10">
                <div className="w-full bg-white w-11/12 shadow-lg h-full flex flex-col">
                    <Tabs
                        sx={{
                            "&": {
                                background: theme.palette.primary.main,
                                borderRadius: '3px',
                                flexShrink: 0,

                            },
                            ".MuiTab-root": {
                                color: '#ffffff',
                                opacity: 0.7,
                                fontFamily: roboto.style,
                            },
                            ".MuiTab-root.Mui-selected": {
                                color: "#ffffff",
                                opacity: 1,
                                zIndex: 10,
                                fontFamily: robotoBold.style,
                            },
                            ".MuiTabs-indicator": {
                                background: 'rgba(0,0,0,0.1)',
                                borderBottom: '3px solid #000000',
                                height: '100%',
                            },
                        }}
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)}
                        variant="scrollable"
                        scrollButtons={false}
                        aria-label="scrollable prevent tabs example"
                    >
                        <Tab icon={<HiDocumentReport size={25} />} iconPosition="start" label="Reportes" />
                        {props.auth.role === 'admin' && <Tab icon={<TfiStatsUp size={25} />} iconPosition="start" label="Estadísticas" />}

                    </Tabs>
                    <div className="flex-1 overflow-y-auto md:p-10">
                        {tab === 0 ? <Reports {...props} /> : <Statistics {...props} />}
                    </div>
                </div>
            </section>
        </Layout>
    );
}

const Reports = (props: AnalyticsProps) => {

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    // IMPORTANTE: 
    // SI input_needed es 'true' abrirá un modal donde hay que hacer las operaciones para imprimir el reporte. Si es 'false', abre una pestaña al path directamente.
    const reports: Report[] = [
        {
            id: 'meeting',
            name: 'Reporte de reuniones por obra social',
            description: 'Este reporte muestra las reuniones que tuvo un médico/varios médicos para un determinado período y obra social',
            path: 'reports/meeting',
            input_needed: true,
            roles: ['doctor', 'admin'],
        },
        {
            id: 'billing',
            name: 'Reporte de pagos a médicos',
            description: 'Este reporte muestra los pagos que se le realizaron a los profesionales médicos para todos los períodos disponibles con su respectivo monto',
            path: 'reports/billing',
            input_needed: true,
            roles: ['admin'],
        }

    ];

    const theme = useTheme();

    // RENDERIZAR LOS REPORTES CUYA PROPIEDAD input_needed SEA 'true', ES DECIR, LOS QUE NO SE VAYAN A ABRIR EN UNA PESTAÑA, SINO EN UN MODAL.
    const renderReport = () => {

        if (!selectedReport) return;

        // AGREGAR UN COMPONENTE POR CADA REPORTE QUE SE NECESITE (NO OLVIDAR ESPECIFICAR)
        const reportsElements = {
            'billing': <BillingReport report={null} props={props} />,
            'meeting': <MeetingReport report={null} props={props} />,
        };

        return React.cloneElement(reportsElements[selectedReport.id as keyof typeof reportsElements], { report: selectedReport });
    };

    return (
        <>
            <TableContainer className="h-full" component={Paper}>
                <Table aria-label="reports table">
                    <TableHead className="sticky top-0" sx={{ bgcolor: theme.palette.primary.main }}>
                        <TableRow>
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
                                Descripción
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.filter(row => row.roles.includes(props.auth.role as any)).map((row, idx) => (
                            <TableRow
                                key={idx}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell
                                    className="text-sm whitespace-nowrap"
                                    align="center"
                                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                                >
                                    <div className="flex items-center gap-1">
                                        <HiDocumentReport color="#34d399" size={15} />
                                        {row.input_needed ?
                                            <Link className="cursor-pointer" onClick={() => setSelectedReport(row)}>{row.name}</Link>
                                            :
                                            <Link className="cursor-pointer" href={`${process.env.NEXT_PUBLIC_API_URL}/${row.path}`} target="_blank">{row.name}</Link>
                                        }
                                    </div>
                                </TableCell>
                                <TableCell
                                    className="text-sm"
                                    align="center"
                                    sx={{ padding: "1.2rem", fontSize: "1.2rem" }}
                                >
                                    {row.description}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={Boolean(selectedReport)}
                onClose={() => setSelectedReport(null)}
                aria-labelledby="report-title"
                aria-describedby="report-description"
            >
                <Fade in={Boolean(selectedReport)}>
                    <Box
                        className="w-11/12 sm:w-auto"
                        sx={{
                            position: "absolute" as "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            outline: 'none',
                        }}
                    >
                        <Typography
                            id="modal-title"
                            variant="h6"
                            component="h2"
                            className={`text-center text-primary text-lg ${robotoBold.className} mb-5`}
                        >
                            {selectedReport?.name}
                        </Typography>
                        {renderReport()}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
};

const Statistics = (props: AnalyticsProps) => {

    const genCanvas = (
        canvas: HTMLCanvasElement,
        type: keyof ChartTypeRegistry,
        data: { x: number; y: number }[],
        label: string
    ) => {
        new Chart(canvas, {
            type,
            data: {
                labels: data.map((row) => row.x),
                datasets: [
                    {
                        label,
                        data: data.map((row) => row.y),
                    },
                ],
            },
            options: {
                responsive: true,
            },
        });
    };

    useEffect(() => {
        (async function () {
            const specialities = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/meeting/charts`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${props.auth.token}` },
                }
            );

            const canvas1 = document.getElementById(
                "acquisitions1"
            ) as HTMLCanvasElement;
            const canvas2 = document.getElementById(
                "acquisitions2"
            ) as HTMLCanvasElement;
            const canvas3 = document.getElementById(
                "acquisitions3"
            ) as HTMLCanvasElement;
            genCanvas(
                canvas3,
                "pie",
                specialities.data[0],
                "Especialidades con más reuniones"
            );
            genCanvas(
                canvas1,
                "bar",
                specialities.data[1],
                "Cantidad de reuniones por año"
            );
            genCanvas(
                canvas2,
                "line",
                specialities.data[2],
                "Dinero acumulado por año"
            );
        })();
    }, []);

    return (
        <div className="px-10 flex flex-col gap-10 items-center">
            <canvas id="acquisitions1"></canvas>
            <canvas id="acquisitions2"></canvas>
            <canvas id="acquisitions3"></canvas>
        </div>
    )
};

const MeetingReport: React.FC<{ report: Report | null, props: AnalyticsProps }> = ({ report, props }) => {

    const [doctors, setDoctors] = useState<any>([]);
    const [healthInsurances, setHealthInsurances] = useState<any>([]);
    const [date, setDate] = useState<Dayjs>(dayjs());
    const [healthInsurance, setHealthInsurance] = useState<any>(null);
    const [doctor, setDoctor] = useState<any>(null);
    const [complete, setComplete] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            let drs = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/doctor/`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${props.auth.token}` },
                }
            );
            drs = await drs.data.items;
            setDoctors(drs);

            let hI = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/healthInsurance`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${props.auth.token}` },
                }
            );

            hI = await hI.data;
            setHealthInsurances(hI);

        };


        fetchData();
    }, []);

    const getReportPath = () => {
        let path = `${process.env.NEXT_PUBLIC_API_URL}/${report?.path}`;

        if (complete) return path;

        path += `?month=${date.month() + 1}&year=${date.year()}${doctor ? `&userId=${doctor.id}` : ''}${healthInsurance ? `&hi=${healthInsurance.id}` : ''}`;

        return path;
    };

    return (
        <>
            <div className="flex flex-col gap-5">
                {props.auth.role === 'admin' && <Autocomplete
                    disabled={complete}
                    className={"w-full"}
                    onChange={(event, newValue: any) => {
                        setDoctor(newValue);
                    }}
                    disablePortal
                    noOptionsText="Médico no encontrado"
                    options={doctors.map((dr: any) => ({
                        id: dr.user.id,
                        label: `${dr.user.name} ${dr.user.surname}`,
                    }))}
                    renderInput={(params: any) => (
                        <Input
                            {...params}
                            label="Médico"
                            variant="outlined"
                        />
                    )}
                />}
                <DatePicker
                    disabled={complete}
                    label="Fecha de pago"
                    views={['month', 'year']}
                    value={date}
                    onChange={(date: Dayjs) => {
                        setDate(date);
                    }}
                />
                <Autocomplete
                    disabled={complete}
                    className={"w-full"}
                    onChange={(event, newValue: any) => {
                        setHealthInsurance(newValue);
                    }}
                    disablePortal
                    noOptionsText="Obra social no encontrada"
                    options={healthInsurances.map((hi: any) => ({
                        id: hi.id,
                        label: hi.name,
                    }))}
                    renderInput={(params: any) => (
                        <Input
                            {...params}
                            label="Obra social"
                            variant="outlined"
                        />
                    )}
                />
                <div className="flex items-center mt-2">
                    <Checkbox className="p-0 mr-1" onChange={(e) => setComplete(e.target.checked)} />
                    <p className="text-sm">Generar reporte completo</p>
                </div>
                <a className="self-end mt-4"
                    href={getReportPath()}
                    target="_blank">
                    <Button>Generar</Button>
                </a>
            </div>
        </>
    )
};

const BillingReport: React.FC<{ report: Report | null, props: AnalyticsProps }> = ({ report, props }) => {

    const [date, setDate] = useState<Dayjs>(dayjs());
    const [complete, setComplete] = useState<boolean>(false);

    return (
        <div className="flex flex-col">
            <DatePicker
                disabled={complete}
                label="Fecha de pago"
                views={['month', 'year']}
                value={date}
                onChange={(date: Dayjs) => {
                    setDate(date);
                }}
            />
            <div className="flex items-center mt-2">
                <Checkbox className="p-0 mr-1" onChange={(e) => setComplete(e.target.checked)} />
                <p className="text-sm">Generar reporte completo</p>
            </div>
            <a className="self-end mt-4"
                href={`${process.env.NEXT_PUBLIC_API_URL}/${report?.path}${!complete ? `?month=${date.month() + 1}&year=${date.year()}` : ''}`}
                target="_blank">
                <Button>Generar</Button>
            </a>
        </div>
    )
};

export const getServerSideProps = withAuth(
    async (auth: Auth | null, context: any) => {


        return {
            props: {
                auth,
            },
        };
    },
    { protected: true, roles: ['doctor', 'admin'] }
);
