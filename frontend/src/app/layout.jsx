import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "HealthTech",
  description: "Consultoria medica remota",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={"container m-auto bg-slate-200 " + roboto.className}>
        {children}
      </body>
    </html>
  );
}
