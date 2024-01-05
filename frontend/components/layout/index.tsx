import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ['latin'], weight: "300" });

interface LayoutProps {
    children: React.ReactElement,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className={`bg-white h-screen ${roboto.className}`}>
            {children}
        </main>
    );
};

export default Layout;