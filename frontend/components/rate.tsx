import React from 'react';
import { useTheme } from '@mui/material';
import Rating from '@mui/material/Rating';

interface RateProps {
    rate: number
    hideNumber?: boolean
    className?: string
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
            }} color='primary' value={Number(props.rate)} precision={0.5} readOnly />
            {!props.hideNumber && <span className="text-md md:ml-2 select-none">({props.rate})</span>}
        </div>
    );
};

export default Rate;