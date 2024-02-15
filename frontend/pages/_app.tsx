import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material';
import { PRIMARY_COLOR, SECONDARY_COLOR, PRIMARY_COLOR_LIGHT } from "@/constants";
import NextNProgress from 'nextjs-progressbar';

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
  breakpoints: {
    values:{
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NextNProgress options={{showSpinner:false}} color={theme.palette.primary.main} height={4}/>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
