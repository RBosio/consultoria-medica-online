import { useTheme } from "@mui/material";
import { DatePicker as DatePickerMUI } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DatePicker: React.FC<any> = (props) => {

    const theme = useTheme();

    return (
        <DatePickerMUI
            {...props}
            defaultValue={dayjs()}
            views={props.views ? props.views : ['year', 'month', 'day']}
            sx={{
                "& label": {
                    color: theme.palette.primary.main
                },
                "&:focus-within label":{
                    fontWeight:"bold"
                }
            }}

        />
    );
};

export default DatePicker;