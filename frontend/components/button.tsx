import MUIButton, { ButtonProps } from "@mui/material/Button";
import { roboto } from "@/lib/fonts";

const Button: React.FC<ButtonProps> = (props) => {
    
    return (
        <MUIButton 
        className={`bg-primary text-white font-bold ${roboto.className} ${props.className}`} 
        color="primary" 
        variant="contained"
        type={props.type}
        sx={props.sx}
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