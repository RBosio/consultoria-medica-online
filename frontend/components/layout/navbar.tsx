import React from "react";
import Avatar from "../avatar";
import { Auth } from "../../../shared/types";

interface NavbarProps {
    auth: Auth,
}


const Navbar: React.FC<NavbarProps> = (props) => {


    return (
        <div className="p-4 bg-white w-full shrink-0 h-20 shadow-lg flex items-center justify-between sm:justify-end">
            <button className="sm:hidden">CERRAR</button>
            <Avatar name={props.auth.name} surname={props.auth.surname} photo={props.auth.photo}/>
        </div>
    );
};

export default Navbar;