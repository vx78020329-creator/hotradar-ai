"use client";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";

const noSidebarRoutes = ["/auth/login", "/auth/register", "/pricing", "/about"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !noSidebarRoutes.some((r) => pathname.startsWith(r));

  return (
    <>
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? "lg:pl-60" : ""}`}>
          <div className="mx-auto max-w-[1600px] px-4 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
      <div className={showSidebar ? "lg:pl-60" : ""}>
        <Footer />
      </div>
    </>
  );
}
