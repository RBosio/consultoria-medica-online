import { useTheme } from "@mui/material";
import { DatePicker as DatePickerMUI } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FormHelperText, FormControl } from "@mui/material";
import "dayjs/locale/es";

const DatePicker: React.FC<any> = (props) => {
  dayjs.locale("es");

  const theme = useTheme();

  return (
    <FormControl>
      <DatePickerMUI
        {...props}
        defaultValue={dayjs()}
        maxDate={props.max || null}
        views={props.views ? props.views : ["year", "month", "day"]}
        sx={{
          "& label": {
            color: props.error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          },
          "&:focus-within label": {
            fontWeight: props.error ? "" : "bold",
            color: props.error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          },
          "& .MuiOutlinedInput-notchedOutline, &:focus-within .MuiOutlinedInput-notchedOutline":
            {
              borderColor: props.error ? theme.palette.error.main : "",
            },
        }}
      />
      {props.error && <FormHelperText error>{props.error}</FormHelperText>}
    </FormControl>
  );
};

export default DatePicker;
