import { roboto } from '@/lib/fonts';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { Auth } from '../../../shared/types';
import { RefObject, useState } from 'react';
interface LayoutProps {
    children: React.ReactElement,
    renderNavbar?: boolean,
    renderSidebar?: boolean,
    className?: string,
    auth: Auth,
    contentRef?: RefObject<any>,
}

const Layout: React.FC<LayoutProps> = ({ children, renderNavbar = true, renderSidebar = true, className, auth, contentRef }) => {

    const [sidebarOpened, setSidebarOpened] = useState(false);

    return (
        <main className={`h-full ${roboto.className} bg-slate-200 flex`}>
            {renderSidebar && <Sidebar auth={auth} sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} />}
            <section className="grow w-full overflow-hidden flex flex-col">
                {renderNavbar && <Navbar auth={auth} sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened}/>}
                <div ref={contentRef} className={`${className ?? ""} overflow-y-auto grow`}>
                    {children}
                </div>
            </section>
        </main>
    );
};

export default Layout;