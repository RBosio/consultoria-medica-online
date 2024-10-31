import { roboto } from "@/lib/fonts";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { Auth } from "../../types";
import { ReactElement, RefObject, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactElement;
  renderNavbar?: boolean;
  renderSidebar?: boolean;
  className?: string;
  auth: Auth;
  contentRef?: RefObject<any>;
  navbarLeftElement?: ReactElement;
  renderProfile?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  renderNavbar = true,
  renderSidebar = true,
  className,
  auth,
  contentRef,
  navbarLeftElement,
  renderProfile = true,
}) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function refreshSession() {
      let refresh;
      try {
        if(localStorage.getItem('refreshSession') === '0') return;
        refresh = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh_session`,
          {
            withCredentials: true, headers: { Authorization: `Bearer ${auth?.token}` }
          });

          if(refresh.data.refreshed) router.reload(); 
      }
      catch (error: any) {
        if ([404, 401].includes(error.response.status)) {
          console.log(error);
        } else {
        };
      }
      finally {
        if (refresh?.data.refreshed) {
          localStorage.setItem('refreshSession', '0');
        };
      };
    };
    refreshSession();
  }, []);

  return (
    <main className={`h-full ${roboto.className} bg-slate-200 flex`}>
      {renderSidebar && (
        <Sidebar
          auth={auth}
          sidebarOpened={sidebarOpened}
          setSidebarOpened={setSidebarOpened}
        />
      )}
      <section className="grow w-full overflow-hidden flex flex-col">
        {renderNavbar && (
          <Navbar
            leftElement={navbarLeftElement}
            renderSidebar={renderSidebar}
            renderProfile={renderProfile}
            auth={auth}
            sidebarOpened={sidebarOpened}
            setSidebarOpened={setSidebarOpened}
          />
        )}
        <div
          ref={contentRef}
          className={`${className ?? ""} overflow-y-auto grow`}
        >
          {children}
        </div>
      </section>
    </main>
  );
};

export default Layout;
