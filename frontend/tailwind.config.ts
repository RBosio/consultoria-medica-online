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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: PRIMARY_COLOR,
        primary_light: PRIMARY_COLOR_LIGHT,
        secondary: SECONDARY_COLOR,
        error: "#d32f2f",
      },
      keyframes: {
        gold: {
          "0%": { "box-shadow": "0px 0px 0px 1px rgba(250, 204, 21, 0.5)" },
          "50%": { "box-shadow": "4px 4px 4px 2px rgba(250, 204, 21, 0.5)" },
          "100%": { "box-shadow": "0px 0px 0px 1px rgba(250, 204, 21, 0.5)" },
        },
      },
      animation: {
        gold: "gold 2s ease-out both infinite",
      },
    },
  },
  plugins: [],
};
export default config;
