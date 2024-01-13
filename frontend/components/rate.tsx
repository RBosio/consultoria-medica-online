import React from 'react';
import { IoStar } from "react-icons/io5";
import { IoStarHalf } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { useTheme } from '@mui/material';

interface RateProps {
    rate: string,
    className?:string,
}

const Rate: React.FC<RateProps> = (props) => {

    const theme = useTheme();

    const getCleanRate = () => {
        const rate = Number(props.rate);
        const rateRoundedBelow = Math.floor(rate);
        const delta = rate - rateRoundedBelow;

        if (delta >= 0.25 && delta < 0.8) return rateRoundedBelow + 0.5;
        if (delta >= 0.8) return rateRoundedBelow + 1;
        return rateRoundedBelow;

    };

    const getStars = () => {
        const cleanRate = getCleanRate();
        const rateRoundedBelow = Math.floor(cleanRate);
        const delta = cleanRate - rateRoundedBelow;

        let starsElements = [];

        for (let i = 0; i < rateRoundedBelow; i++) {
            starsElements.push(<IoStar key={i} size={20} color={theme.palette.primary.main} />);
        };

        if (delta === 0.5) {
            starsElements.push(<IoStarHalf key="half" size={20} color={theme.palette.primary.main} />);
        }
        else if (delta === 1) {
            starsElements.push(<IoStar key="full" size={20} color={theme.palette.primary.main} />);
        };

        const starsToFill = 5 - Math.round(cleanRate);

        for (let i = 0; i < starsToFill; i++) {
            starsElements.push(<IoStarOutline key={i + 10} size={20} color={theme.palette.primary.main} />);
        };

        return starsElements;
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center ${props.className}`}>
            <div className="flex gap-1 items-center">
                {getStars()}
            </div>
            <span className="text-md font-bold md:ml-2">{props.rate}</span>
        </div>
    );
};

export default Rate;