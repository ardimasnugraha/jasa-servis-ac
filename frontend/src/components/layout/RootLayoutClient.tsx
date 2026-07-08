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
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
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
    <header className="bg-[#1e3d75] text-white shadow-md select-none w-full border-b border-white/10 shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="h-9 w-9 bg-yellow-400 rounded-lg flex items-center justify-center text-[#1e3d75] shadow-sm">
            <Wrench className="h-5 w-5 font-bold" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight block leading-none">SERVIS KITA</span>
            <span className="text-[9px] font-semibold text-yellow-400 uppercase tracking-widest">Ahli & Profesional</span>
          </div>
        </Link>

        {/* Middle Nav - Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-white/90">
          <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Bantuan
          </Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Jadi Mitra
          </Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" /> Chat
          </Link>
          <Link href={user ? (user.role === "ADMIN" ? "/dashboard" : "/client/dashboard") : "/login"} className="hover:text-yellow-400 transition-colors">
            Pesanan
          </Link>
        </nav>

        {/* Right Nav - Cart & Profile/Auth */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <div className="relative cursor-pointer p-1.5 hover:bg-white/10 rounded-full transition-all">
            <ShoppingBag className="h-4.5 w-4.5 text-white" />
            <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center text-white border border-[#1e3d75]">
              0
            </span>
          </div>

          {/* Login / Register or Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user.role === "ADMIN" ? "/dashboard" : "/client/dashboard"}>
                <Button variant="ghost" className="h-8 px-3 rounded-lg border border-white/20 hover:bg-white/10 hover:text-white text-[11px] font-bold gap-1.5">
                  <User className="h-3 w-3" />
                  {user.fullname ? user.fullname.split(" ")[0] : "Akun"}
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-100"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="h-8 px-3 rounded-lg border border-white/20 hover:bg-white/10 hover:text-white text-[11px] font-semibold flex items-center gap-1">
                  <User className="h-3 w-3" /> Login
                </Button>
              </Link>
              <span className="text-white/20 text-xs">|</span>
              <Link href="/register" className="text-[11px] font-semibold hover:text-yellow-400 transition-colors">
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

  // Cek apakah halaman adalah halaman Admin/Teknisi/Owner internal
  const isAdminRoute = pathname?.startsWith("/dashboard") || 
                       pathname?.startsWith("/customers") || 
                       pathname?.startsWith("/technicians") || 
                       pathname?.startsWith("/bookings") || 
                       pathname?.startsWith("/invoices") || 
                       pathname?.startsWith("/payments") || 
                       pathname?.startsWith("/reports") || 
                       pathname?.startsWith("/settings");

  const isClientRoute = pathname?.startsWith("/client") || false;

  useEffect(() => {
    setMounted(true);
    
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

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
    
    if (isAuth) {
      setAuthorized(true);
    }
  }, [pathname, isAdminRoute, isClientRoute, router]);

  if (!mounted) return null; // Avoid hydration mismatch

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-transparent border-t-[#0d6e6a] animate-spin" />
          <p className="text-xs font-semibold text-[#577b78] tracking-wide">Memeriksa Otorisasi Akses...</p>
        </div>
      </div>
    );
  }

  // Jika bukan rute admin (artinya rute publik /, /login, /register, /pay/*, atau /client/*)
  if (!isAdminRoute) {
    if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/pay/")) {
      return <main className="flex-1 overflow-y-auto bg-slate-950 text-white">{children}</main>;
    }

    // Gunakan full-screen layout lebar penuh tanpa sidebar
    return (
      <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col">
        {/* Render header untuk /client/* (halaman / memiliki header kustom tersendiri) */}
        {isClientRoute && <ClientHeader />}
        <main className="flex-grow w-full">
          {children}
        </main>
      </div>
    );
  }

  // Fallback untuk Admin / Teknisi / Owner Dashboard (menggunakan layout sidebar bawaan)
  return (
    <div className="h-screen w-screen flex items-center justify-center p-0 md:p-5 lg:p-6 bg-gradient-to-tr from-[#bfe7e2] via-[#edf7f5] to-[#ebdff7] overflow-hidden select-none">
      <div className="w-full h-full max-w-7xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_24px_85px_rgba(13,110,106,0.06)] rounded-none md:rounded-[2.5rem] flex overflow-hidden relative">
        
        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
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
