import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ['latin'], weight: "300" });
const robotoSemiBold = Roboto({weight: "700", subsets:["latin"]})
const robotoBold = Roboto({weight:"900", subsets:["latin"]});

export {roboto, robotoSemiBold ,robotoBold};