import { roboto } from '@/lib/fonts';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { Auth } from '../../../shared/types';

interface LayoutProps {
    children: React.ReactElement,
    renderNavbar?: boolean,
    renderSidebar?: boolean,
    className?: string,
    auth: Auth,
}

const Layout: React.FC<LayoutProps> = ({ children, renderNavbar = true, renderSidebar = true, className, auth }) => {

    return (
        <main className={`h-full ${roboto.className} bg-slate-200 flex`}>
            {renderSidebar && <Sidebar auth={auth}/>}
            <section className="grow w-full break-all overflow-hidden flex flex-col">
                {renderNavbar && <Navbar auth={auth} />}
                <div className={`${className} overflow-y-auto grow`}>
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;