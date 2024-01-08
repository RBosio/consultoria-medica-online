import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material';
import { PRIMARY_COLOR, SECONDARY_COLOR, PRIMARY_COLOR_LIGHT } from "@/constants";

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      light: PRIMARY_COLOR_LIGHT
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
