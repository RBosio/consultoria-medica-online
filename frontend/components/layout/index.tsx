import { roboto } from '@/lib/fonts';
import Sidebar from './sidebar';
import Navbar from './navbar';

interface LayoutProps {
    children: React.ReactElement,
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className={`h-full ${roboto.className} bg-slate-200 flex`}>
            <Sidebar />
            <section className="grow w-full break-all overflow-hidden">
                <Navbar />
                <div className="p-4 overflow-y-auto h-[calc(100%-5rem)]">
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;