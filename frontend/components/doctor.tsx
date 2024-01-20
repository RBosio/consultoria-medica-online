import { Chip } from '@mui/material';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Rate from './rate';
import { robotoBold } from '@/lib/fonts';
import Button from './button';
import { FaUserDoctor } from "react-icons/fa6";

export interface DoctorProps {
    fullName: string,
    photo?: string,
    description: string,
    id: number,
    rate: number,
    specialities: any[],

}

const Doctor: React.FC<DoctorProps> = (props) => {

    const onConsultClick = () => {

    };

    return (
        <div className="bg-white w-full rounded-md shadow-md h-64 sm:h-56 flex">
            {
                props.photo ?
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/user/${props.photo}`} alt="Profile photo" className='h-64 sm:h-56 object-cover w-48' />
                    :
                    <div className="w-[14.5rem] bg-primary flex items-center justify-center">
                        <FaUserDoctor color="#ffffff" size={80} />
                    </div>
            }
            <div className="py-4 px-8 w-full flex flex-col sm:flex-row justify-between">
                <div className='w-full sm:w-7/12 h-full'>
                    <h2 className={`${robotoBold.className} text-2xl text-primary`}>{props.fullName}</h2>
                    <div className="flex gap-2">
                        {props.specialities.map(spec => <Chip key={spec.id} size='small' variant='outlined' color='primary' label={spec.name} />)}
                    </div>
                    <p className="mt-4 line-clamp-3 lg:line-clamp-5">{props.description}</p>
                </div>
                <div className="shrink-0 flex flex-row sm:flex-col items-start justify-between sm:h-full sm:items-center sm:justify-center gap-4">
                    <Rate rate={props.rate}/>
                    <Button onClick={onConsultClick} size='medium' startIcon={<IoIosArrowForward />}>CONSULTAR</Button>
                </div>
            </div>
        </div>
    );
};

export default Doctor;