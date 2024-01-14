import React, { useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import IconButton from '@mui/material/IconButton';

type ExtendedTextFieldProps = TextFieldProps & {
    startadornment?: any;
    endadornment?: any;
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
            {...props}
            className={props.className}
            type={props.type === "password" && showPassword ? "text" : props.type}
            name={props.name}
            onChange={props.onChange}
            fullWidth={props.fullWidth}
            onBlur={props.onBlur}
            value={props.value}
            placeholder={props.placeholder}
            helperText={props.helperText}
            label={props.label}
            error={props.error}
            InputLabelProps={{
                sx: {
                    "&": { color: theme.palette.primary.main }
                },
                shrink: true,
            }}
            InputProps={{
                startAdornment: props.startadornment,
                endAdornment: props.type === "password" ? passwordHandler : props.endadornment,
                ...props.InputProps,
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
                },
                ...props.sx
            }}
        />
    );
};

export default Input;