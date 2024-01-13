import { Chip } from '@mui/material';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Rate from './rate';
import { robotoBold } from '@/lib/fonts';
import Button from './button';

interface DoctorProps {

}

const Doctor: React.FC<DoctorProps> = () => {
    return (
        <div className="bg-white rounded-md shadow-md h-64 sm:h-56 flex">
            <div className="shrink-0 h-full w-36 lg:w-56 bg-cover bg-[url('https://professions.ng/wp-content/uploads/2023/07/The-Process-of-Becoming-a-Doctor-in-Nigeria-A-Roadmap2.jpg')]" />
            <div className="py-4 px-8 w-full flex flex-col sm:flex-row justify-between">
                <div className='w-full sm:w-7/12 h-full'>
                    <h2 className={`${robotoBold.className} text-2xl text-primary`}>Roberto Carlos</h2>
                    <Chip size='small' variant='outlined' color='primary' label="Cardiólogo" />
                    <p className="mt-4 line-clamp-3 lg:line-clamp-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe possimus ad ea nisi iusto temporibus cum, voluptatibus fugiat magnam maiores consequatur, architecto harum dignissimos deleniti eius, quisquam natus minus quas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel aspernatur repellendus, eos, cupiditate consectetur eum modi laboriosam vero officia quibusdam earum tenetur omnis similique autem ab facilis aut. Laborum, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, deleniti deserunt iste corporis possimus, eos facere quis quidem, consequuntur sapiente quae! Quidem repellendus ab nemo praesentium. Sequi modi quis et!</p>
                </div>
                <div className="shrink-0 flex flex-row sm:flex-col items-start justify-between sm:h-full sm:items-center sm:justify-center gap-4">
                    <Rate rate={"3.67"} />
                    <Button size='medium' startIcon={<IoIosArrowForward />}>CONSULTAR</Button>
                </div>
            </div>
        </div>
    );
};

export default Doctor;