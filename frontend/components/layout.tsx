import { createTheme, ThemeProvider } from "@mui/material";
import { roboto } from '@/utils/fonts';
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants";

const theme = createTheme({
    palette: {
        primary: {
            main: PRIMARY_COLOR,
        },
        secondary: {
            main: SECONDARY_COLOR,
        },
    },
});

interface LayoutProps {
    children: React.ReactElement,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <main className={`bg-white h-screen ${roboto.className}`}>
                {children}
            </main>
        </ThemeProvider>
    );
};

export default Layout;