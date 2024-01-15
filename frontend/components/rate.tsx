import React from 'react';
import { useTheme } from '@mui/material';
import Rating from '@mui/material/Rating';

interface RateProps {
    rate: number,
    className?: string,
}

const Rate: React.FC<RateProps> = (props) => {

    const theme = useTheme();

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center ${props.className}`}>
            <Rating sx={{
                '& .MuiRating-iconFilled': {
                    color: theme.palette.primary.main,
                },
                '& .MuiRating-iconHover': {
                    color: theme.palette.primary.main,
                },
            }} color='primary' value={props.rate} precision={0.5} readOnly />
            <span className="text-md font-bold md:ml-2">{props.rate}</span>
        </div>
    );
};

export default Rate;