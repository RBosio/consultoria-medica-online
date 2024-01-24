import Layout from "@/components/layout";
import withAuth from "@/lib/withAuth";
import React, { useState } from "react";
import { Auth } from "../../../shared/types";
import axios from "axios";
import Avatar from "@/components/avatar";
import { FaUserDoctor } from "react-icons/fa6";
import { roboto, robotoBold } from "@/lib/fonts";
import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Rate from "@/components/rate";
import { useTheme } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import { FaPhone, FaSuitcaseMedical, FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoTimeSharp } from "react-icons/io5";
import Button from "@/components/button";

export default function Doctor(props: any) {

    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState("");
    const [confirmTurn, setConfirmTurn] = useState(false);

    const handleDateChange = (
        event: React.MouseEvent<HTMLElement>,
        newDate: any,
    ) => {
        setSelectedDate(newDate);
    };

    const getFormattedSelectedDate = () => {
        if(!selectedDate) return {day: "", time: ""};
        let [day, time] = selectedDate.split("-");
        day = day.charAt(0).toUpperCase() + day.slice(1);
        return { day, time };
    };

    const onConfirmClick = () => {
        
    };

    return (
        <Layout auth={props.auth}>
            <section className="h-full flex p-8 overflow-hidden">
                <div className="w-full flex flex-col xl:flex-row gap-6 mt-[3rem]">
                    <div className="w-full rounded-md md:w-[calc(100%-15rem)] xl:shadow-md xl:bg-white xl:min-w-64 xl:w-5/12 relative">
                        <Avatar
                            labelProps={{ className: "hidden" }}
                            name={props.doctor.user.name}
                            surname={props.doctor.user.surname}
                            rootClassName="absolute top-[-4rem] left-1/2 translate-x-[-50%]"
                            className="bg-primary"
                            size={130}
                            icon={<FaUserDoctor size={60} />}
                            photo={props.doctor.user.image ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.doctor.user.image}` : undefined} />
                        <div className="mt-20">
                            <div className="flex flex-col items-center gap-3">
                                <h2 className={`text-primary text-center ${robotoBold.className} text-3xl`}>{props.doctor.user.name} {props.doctor.user.surname}</h2>
                                <div className="flex gap-2">
                                    {props.doctor.specialities.map((spec: any) => <Chip key={spec.id} size='small' variant='outlined' color='primary' label={spec.name} />)}
                                </div>
                                <Rate rate={Number(props.doctor.avgRate)} />
                                <Divider variant="middle" sx={{
                                    "&": {
                                        width: "70%",
                                    },
                                    "&::before, &::after": {
                                        borderTop: `thin solid ${theme.palette.primary.main}`,
                                    }
                                }}>
                                    <GoDotFill color={theme.palette.primary.main} />
                                </Divider>

                                <div className="w-full p-4 flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-primary text-xl">Descripción</h2>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, vel quam. Quam exercitationem nesciunt reprehenderit aliquam? Magnam, voluptates, quia accusantium tempora quae fuga minus eaque aut rem iste consequuntur asperiores? Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde eum laboriosam esse, expedita facilis voluptate placeat quidem consequatur voluptas rerum deserunt aut libero cum eos non neque suscipit necessitatibus animi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam laborum sit ipsa iure debitis nostrum minima nisi.</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-primary text-xl">Datos de Contacto</h2>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <IoMdMail size={15} />
                                                <p className="text-secondary">mail@gmail.com</p>
                                            </div>
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <FaPhone size={15} />
                                                <p className="text-secondary">341670803</p>
                                            </div>
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <FaSuitcaseMedical size={15} />
                                                <p className="text-secondary">OSDE</p>
                                            </div>
                                            <div className="flex gap-2 text-primary items-center font-bold">
                                                <FaLocationDot size={15} />
                                                <p className="text-secondary">St.Exupery 200</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white p-4 gap-2 rounded-md shadow-md grow">
                        <div className="flex gap-2 items-center ">
                            <IoTimeSharp size={20} color={theme.palette.primary.main} />
                            <h2 className={`text-primary text-2xl ${roboto.className}`}>Solicitar Turno</h2>
                        </div>
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col gap-4">
                                {props.doctorAvailability.map((da: any) => {
                                    let [day, date] = da.date.split(", ");
                                    day = day.charAt(0).toUpperCase() + day.slice(1);
                                    return (
                                        <div key={da.date} className="">
                                            <h2 className={`text-primary text-lg mb-1`}><span className="font-bold">{day}</span>, {date}</h2>
                                            <div>
                                                <ToggleButtonGroup exclusive onChange={handleDateChange} value={selectedDate} size="small" aria-label="Small sizes">
                                                    {da.schedule.map((sch: any) => (
                                                        sch.available && <ToggleButton sx={{
                                                            "&.MuiToggleButton-root , &.MuiToggleButton-root.Mui-disabled": {
                                                                border: `1px solid ${theme.palette.primary.light}`,
                                                                transition: "background .2s ease",
                                                            },
                                                            "&:hover, &.MuiToggleButton-root.Mui-selected:hover": {
                                                                background: theme.palette.primary.light,
                                                            },
                                                            "&.Mui-disabled": {
                                                                background: "#F7F7F7",
                                                            },
                                                            "&.Mui-selected": {
                                                                background: theme.palette.primary.main,
                                                                color: "#ffffff",
                                                                fontWeight: "bold",
                                                            }
                                                        }} value={`${da.date}-${sch.time}`} key={`${da.date}-${sch.time}`}>
                                                            {sch.time}
                                                        </ToggleButton>
                                                    ))}
                                                </ToggleButtonGroup>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                            <div className="flex justify-center items-center">
                                <Button onClick={() => setConfirmTurn(true)} disabled={!Boolean(selectedDate)} className="w-40 my-6">Aceptar</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog
                    open={confirmTurn}
                    onClose={() => setConfirmTurn(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirmar turno
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Estás seguro que deseas sacar el turno para el <b>{getFormattedSelectedDate().day}</b> a las <b>{getFormattedSelectedDate().time}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="error" variant="text" onClick={() => setConfirmTurn(false)}>Cancelar</Button>
                        <Button onClick={onConfirmClick} autoFocus>
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </section>
        </Layout >
    );
};


export const getServerSideProps = withAuth(async (auth: Auth | null, context: any) => {

    let { query } = context;

    try {
        let doctor = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${query.id}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${context.req.cookies.token}` }
            });

        doctor = doctor.data;

        let doctorAvailability = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedule/doctor/${query.id}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${context.req.cookies.token}` }
            });

        doctorAvailability = doctorAvailability.data;


        return {
            props: {
                doctor,
                doctorAvailability,
                auth,
            }
        }
    }

    catch {
        return {
            props: {
                auth
            }
        }
    };


}, true)