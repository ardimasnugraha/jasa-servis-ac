"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  HelpCircle, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  User, 
  LogOut 
} from "lucide-react";
import Link from "next/link";

// -------------------------------------------------------------
// CLIENT HEADER COMPONENT (Shared between / and /client/*)
// -------------------------------------------------------------
function ClientHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md text-gray-900 shadow-sm select-none w-full border-b border-black/[0.06] shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight block leading-none text-gray-900">SERVIS KITA</span>
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Ahli & Profesional</span>
          </div>
        </Link>

        {/* Middle Nav - Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-500">
          <Link href="#" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Bantuan
          </Link>
          <Link href="#" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Jadi Mitra
          </Link>
          <Link href={user ? (user.role === "ADMIN" ? "/dashboard/chat" : "/client/chat") : "/login"} className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" /> Chat
          </Link>
          <Link href={user ? (user.role === "ADMIN" ? "/dashboard" : "/client/dashboard") : "/login"} className="hover:text-gray-900 transition-colors">
            Pesanan
          </Link>
        </nav>

        {/* Right Nav */}
        <div className="flex items-center gap-2.5">
          {/* Cart */}
          <div className="relative cursor-pointer p-1.5 hover:bg-gray-100 rounded-lg transition-all">
            <ShoppingBag className="h-4 w-4 text-gray-600" />
            <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center text-white border-2 border-white">0</span>
          </div>

          {/* Login / Register or Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === "ADMIN" ? "/dashboard" : "/client/dashboard"}>
                <Button variant="ghost" className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-[11px] font-bold gap-1.5">
                  <User className="h-3 w-3" />
                  {user.fullname ? user.fullname.split(" ")[0] : "Akun"}
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 text-[11px] font-semibold flex items-center gap-1">
                  <User className="h-3 w-3" /> Login
                </Button>
              </Link>
              <span className="text-gray-300 text-xs">|</span>
              <Link href="/register" className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const isAdminRoute = pathname?.startsWith("/dashboard") || 
                       pathname?.startsWith("/customers") || 
                       pathname?.startsWith("/technicians") || 
                       pathname?.startsWith("/bookings") || 
                       pathname?.startsWith("/services") || 
                       pathname?.startsWith("/invoices") || 
                       pathname?.startsWith("/payments") || 
                       pathname?.startsWith("/reports") || 
                       pathname?.startsWith("/settings");

  const isClientRoute = pathname?.startsWith("/client") || false;

  useEffect(() => {
    setMounted(true);
    
    let user = null;
    try {
      const userData = localStorage.getItem("user");
      user = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error("Corrupted user localStorage data, clearing...", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    let isAuth = true;
    if (isAdminRoute) {
      if (!user) {
        setAuthorized(false);
        router.push("/login");
        isAuth = false;
      } else if (user.role !== "ADMIN") {
        setAuthorized(false);
        router.push("/");
        isAuth = false;
      }
    } else if (isClientRoute) {
      if (!user) {
        setAuthorized(false);
        const currentSearch = window.location.search;
        router.push(`/login?redirect=${pathname}${currentSearch}`);
        isAuth = false;
      } else if (user.role !== "USER") {
        setAuthorized(false);
        router.push("/dashboard");
        isAuth = false;
      }
    }
    
    if (isAuth) setAuthorized(true);
  }, [pathname, isAdminRoute, isClientRoute, router]);

  if (!mounted) return null;

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
          <p className="text-xs font-semibold text-gray-500 tracking-wide">Memeriksa Otorisasi Akses...</p>
        </div>
      </div>
    );
  }

  if (!isAdminRoute) {
    if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/pay/")) {
      return <main className="flex-1 overflow-y-auto bg-gray-50 text-gray-900">{children}</main>;
    }

    if (isClientRoute) {
      return (
        <div className="min-h-screen w-full text-gray-900 flex flex-col blob-bg" style={{ background: 'linear-gradient(135deg, #ebebeb 0%, #f5f5f5 50%, #e8e8e8 100%)' }}>
          <ClientHeader />
          <main className="flex-grow w-full">{children}</main>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-full blob-bg flex flex-col" style={{ background: 'linear-gradient(135deg, #ebebeb 0%, #f5f5f5 50%, #e8e8e8 100%)' }}>
        <main className="flex-grow w-full">{children}</main>
      </div>
    );
  }

  // Admin / Dashboard Layout
  return (
    <div className="h-screen w-screen flex items-center justify-center p-0 md:p-4 lg:p-5 overflow-hidden select-none blob-bg" style={{ background: 'linear-gradient(145deg, #e8e8e8 0%, #f5f5f5 45%, #ebebeb 100%)' }}>
      <div className="w-full h-full max-w-[1440px] bg-white/50 backdrop-blur-xl border border-white/70 shadow-[0_24px_85px_rgba(0,0,0,0.06)] rounded-none md:rounded-[2.5rem] flex overflow-hidden relative">
        
        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}
        
        {/* Mobile Sidebar drawer */}
        <div className={`md:hidden fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          <Sidebar closeMobileMenu={() => setSidebarOpen(false)} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden bg-transparent">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
