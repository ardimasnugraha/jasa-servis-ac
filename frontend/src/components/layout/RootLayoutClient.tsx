"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Jika di halaman Auth (Login/Register) atau Pembayaran (/pay), jangan tampilkan sidebar atau topbar
  if (pathname === "/login" || pathname === "/register" || pathname.startsWith("/pay/")) {
    return <main className="flex-1 overflow-y-auto bg-slate-950">{children}</main>;
  }

  const isClientRoute = pathname.startsWith("/client");

  return (
    <div className="h-screen w-screen flex items-center justify-center p-0 md:p-5 lg:p-6 bg-gradient-to-tr from-[#bfe7e2] via-[#edf7f5] to-[#ebdff7] overflow-hidden select-none">
      <div className="w-full h-full max-w-7xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_24px_85px_rgba(13,110,106,0.06)] rounded-none md:rounded-[2.5rem] flex overflow-hidden relative">
        
        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}
        
        {/* Mobile Sidebar drawer */}
        <div className={`md:hidden fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          {isClientRoute ? (
            <ClientSidebar closeMobileMenu={() => setSidebarOpen(false)} />
          ) : (
            <Sidebar closeMobileMenu={() => setSidebarOpen(false)} />
          )}
        </div>

        {isClientRoute ? (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex shrink-0">
              <ClientSidebar />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden bg-transparent">
              {/* Client Mobile Topbar */}
              <div className="md:hidden flex h-14 items-center justify-between px-4 border-b border-[#e0edea] bg-[#ebf5f3]/20 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-[#0d6e6a]">
                  <Menu className="h-5 w-5" />
                </Button>
                <span className="font-bold text-xs text-[#0d2d2a] tracking-wide">Portal Pelanggan</span>
                <div className="w-8" />
              </div>
              
              <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
          </>
        ) : (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex shrink-0">
              <Sidebar />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden bg-transparent">
              <Topbar onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
