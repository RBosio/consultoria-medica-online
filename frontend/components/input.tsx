import React, { useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';

type ExtendedTextFieldProps = TextFieldProps & {
    startAdornment?: any;
    endAdornment?: any;
};

const Input: React.FC<ExtendedTextFieldProps> = (props) => {

    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const passwordHandler =
        <IconButton onMouseDown={() => setShowPassword(true)} onMouseUp={() => { setShowPassword(false) }}>
            {showPassword ?
                <BsEyeSlash color={`${theme.palette.secondary.main}`} />
                :
                <BsEye color={`${theme.palette.secondary.main}`} />
            }
        </IconButton>

    return (
        <TextField
            className={props.className}
            type={props.type === "password" && showPassword ? "text" : props.type}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            placeholder={props.placeholder}
            helperText={props.helperText}
            label={props.label}
            error={props.error}
            InputLabelProps={{
                sx: {
                    "&": {color: theme.palette.primary.main}
                }   
            }}
            InputProps={{
                startAdornment: props.startAdornment,
                endAdornment: props.type === "password" ? passwordHandler : props.endAdornment,
            }}
            variant='standard'
            sx={{
                "& .MuiInputBase-input": {
                    color: theme.palette.secondary.main,
                },
                "& .MuiInput-root:not(.Mui-disabled, .Mui-error):before": {
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                },
                "& .MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before": {
                    borderBottom: `1px solid #166534`,
                }
            }}
        />
    );
};

export default Input;