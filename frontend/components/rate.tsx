import React from "react";
import { useTheme } from "@mui/material";
import Rating, {RatingProps} from "@mui/material/Rating";
interface RateProps extends RatingProps{
  rate: number;
  count?: number;
  hideNumber?: boolean;
  className?: string;
}

const Rate: React.FC<RateProps> = (props) => {
  const theme = useTheme();

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center ${props.className}`}
    >
      <Rating
        sx={{
          "& .MuiRating-iconFilled": {
            color: theme.palette.primary.main,
          },
          "& .MuiRating-iconHover": {
            color: theme.palette.primary.main,
          },
        }}
        color="primary"
        value={Number(props.rate)}
        precision={0.5}
        readOnly
        {...props}
      />
      {!props.hideNumber && (
        <div className="text-md md:ml-2 select-none flex items-center gap-2">
          <p className="text-primary font-semibold">{props.rate}</p>
          {props.count! >= 0 && <span>({props.count} valoraciones)</span>}
        </div>
      )}
    </div>
  );
};

export default Rate;
