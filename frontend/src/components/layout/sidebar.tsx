'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wrench,
  FileText,
  CreditCard,
  Settings,
  BellRing,
  LogOut,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard',   href: '/dashboard',    icon: LayoutDashboard, color: 'text-blue-400' },
  { name: 'Pelanggan',   href: '/customers',    icon: Users,            color: 'text-cyan-400' },
  { name: 'Teknisi',     href: '/technicians',  icon: Wrench,           color: 'text-violet-400' },
  { name: 'Booking',     href: '/bookings',     icon: Calendar,         color: 'text-emerald-400' },
  { name: 'Servis',      href: '/services',     icon: BellRing,         color: 'text-amber-400' },
  { name: 'Invoice',     href: '/invoices',     icon: FileText,         color: 'text-rose-400' },
  { name: 'Pembayaran',  href: '/payments',     icon: CreditCard,       color: 'text-pink-400' },
  { name: 'Laporan',     href: '/reports',      icon: BarChart3,        color: 'text-indigo-400' },
  { name: 'Pengaturan',  href: '/settings',     icon: Settings,         color: 'text-slate-400' },
];

export function Sidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-full w-64 flex-col px-3 py-5 relative overflow-hidden bg-[#ebf5f3]/40 border-r border-[#e0edea] z-10 shrink-0"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.45 0.14 185)' }} />
      <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.70 0.15 310)' }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8 relative z-10">
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, oklch(0.45 0.14 185), oklch(0.55 0.18 200))' }}
        >
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#0d2d2a] leading-tight tracking-wide">AC KITA</span>
          <span className="text-xs text-[#577b78]">Management System</span>
        </div>
      </div>

      {/* Label section */}
      <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3 relative z-10 text-[#577b78]">
        Menu Utama
      </p>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-[#417874] hover:text-[#0d2d2a] hover:bg-[#0d6e6a]/5'
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, #0d6e6a 0%, #128a85 100%)',
                boxShadow: '0 8px 20px rgba(13,110,106,0.18)'
              } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isActive ? 'bg-white/15' : 'bg-[#0d6e6a]/5 group-hover:bg-[#0d6e6a]/10'
                }`}>
                  <item.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-[#417874] group-hover:text-[#0d2d2a]'}`} />
                </div>
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-white" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 pt-4 relative z-10" style={{ borderTop: '1px solid #e0edea' }}>
        {/* Help card */}
        <div
          className="rounded-xl p-3 mb-3 border border-[#0d6e6a]/10"
          style={{ background: 'linear-gradient(135deg, rgba(13,110,106,0.08) 0%, rgba(18,138,133,0.04) 100%)' }}
        >
          <p className="text-xs font-semibold text-[#0d3d3b] mb-0.5">Butuh Bantuan?</p>
          <p className="text-xs text-[#577b78]">Hubungi tim support kami kapan saja.</p>
        </div>

        {/* Logout */}
        <Link
          href="/login"
          onClick={() => {
            if (closeMobileMenu) closeMobileMenu();
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-500/10 hover:text-red-700"
        >
          <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          Keluar (Logout)
        </Link>
      </div>
    </div>
  );
}
