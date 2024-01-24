import MUIButton, { ButtonProps } from "@mui/material/Button";
import { roboto } from "@/lib/fonts";
import { useTheme } from "@mui/material";

const Button: React.FC<ButtonProps> = (props) => {
    
    const theme = useTheme();

    return (
        <MUIButton 
        {...props}
        className={`${roboto.className} ${props.className}`} 
        color={props.color ?? "primary"}
        variant={props.variant ?? "contained"}
        type={props.type}
        sx={{
            ...props.sx,
            "&.MuiButton-contained": {
               background: theme.palette.primary.main,
               color: "#ffffff",
               fontWeight:"bold", 
            },
            "&.MuiButton-contained.Mui-disabled": {
                background: "#CAC5C5",
                opacity: .5,
            }
        }}
        onClick={props.onClick}
        disabled={props.disabled}
        startIcon={props.startIcon}
        endIcon={props.endIcon}
        size={props.size}
        >
            {props.children}
        </MUIButton>
    );
};

export default Button;