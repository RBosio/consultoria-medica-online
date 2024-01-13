import React, { ReactElement } from "react";
import { SliderProps } from "@mui/material";
import SliderMUI from '@mui/material/Slider';

type ExtendedSliderProps = SliderProps & {
    label?: string,
    icon?: ReactElement,
}

const Slider: React.FC<ExtendedSliderProps> = (props) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 text-primary">
                {props.icon ?? null}
                <p className="text-[0.8em] font-bold">{props.label}</p>
            </div>
            <SliderMUI {...props} />
        </div>
    );
};

export default Slider;