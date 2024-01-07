import React from "react";
import { Avatar as MUIAvatar } from "@mui/material";

interface AvatarProps {
    name: string,
    surname: string,
    photo?: string,
}

//IMPLEMENTACIÓN DE: https://mui.com/material-ui/react-avatar/#system-BackgroundLetterAvatars.tsx
function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

const Avatar: React.FC<AvatarProps> = (props) => {

    const getFirstUppercaseChar = (str: string) => str.charAt(0).toUpperCase();

    const fullName = `${props.name} ${props.surname}`;
    const firstTwoChars = `${getFirstUppercaseChar(props.name)}${getFirstUppercaseChar(props.surname)}`;

    return (
        <MUIAvatar
            alt={fullName}
            src={props.photo}
            sx={{ bgcolor: stringToColor(fullName) }}
        >
            {firstTwoChars}
        </MUIAvatar>
    );
};

export default Avatar;