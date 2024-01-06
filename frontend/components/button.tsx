import MUIButton, { ButtonProps } from "@mui/material/Button";
import { roboto } from "@/utils/fonts";

const Button: React.FC<ButtonProps> = (props) => {
    
    return (
        <MUIButton 
        className={`bg-primary text-white font-bold ${roboto.className} ${props.className}`} 
        color="primary" 
        variant="contained"
        type={props.type}
        onClick={props.onClick}
        >
            {props.children}
        </MUIButton>
    );
};

export default Button;