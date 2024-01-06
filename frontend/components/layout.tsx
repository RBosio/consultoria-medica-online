import { roboto } from '@/utils/fonts';


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