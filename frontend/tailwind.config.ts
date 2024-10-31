import type { Config } from "tailwindcss";
import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_LIGHT,
  SECONDARY_COLOR,
} from "./constants";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: PRIMARY_COLOR,
        primary_light: PRIMARY_COLOR_LIGHT,
        secondary: SECONDARY_COLOR,
        error: "#d32f2f",
      },
    },
  },
  plugins: [],
};
export default config;
