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
  BarChart3,
  MessageSquare,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard',   href: '/dashboard',    icon: LayoutDashboard },
  { name: 'Pelanggan',   href: '/customers',    icon: Users },
  { name: 'Teknisi',     href: '/technicians',  icon: Wrench },
  { name: 'Booking',     href: '/bookings',     icon: Calendar },
  { name: 'Servis',      href: '/services',     icon: BellRing },
  { name: 'Invoice',     href: '/invoices',     icon: FileText },
  { name: 'Pembayaran',  href: '/payments',     icon: CreditCard },
  { name: 'Laporan',     href: '/reports',      icon: BarChart3 },
  { name: 'Chat',        href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Pengaturan',  href: '/settings',     icon: Settings },
];

export function Sidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-60 flex-col px-3 py-5 relative overflow-hidden bg-white/75 backdrop-blur-xl border-r border-black/[0.06] z-10 shrink-0">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.07] blur-3xl pointer-events-none bg-gray-400" />
      <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full opacity-[0.05] blur-3xl pointer-events-none bg-gray-400" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8 relative z-10">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 bg-gray-900">
          <Wrench className="h-4.5 w-4.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 leading-tight tracking-wide">SERVIS KITA</span>
          <span className="text-[10px] text-gray-400 font-medium">Management System</span>
        </div>
      </div>

      {/* Label section */}
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] px-3 mb-2 relative z-10 text-gray-400">
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
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70'
              }`}
            >
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                isActive ? 'bg-white/15' : 'bg-gray-100 group-hover:bg-gray-200/70'
              }`}>
                <item.icon className={`h-3.5 w-3.5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 pt-4 relative z-10 border-t border-gray-100">
        {/* Help card */}
        <div className="rounded-xl p-3 mb-3 bg-gray-50 border border-gray-100">
          <p className="text-xs font-semibold text-gray-800 mb-0.5">Butuh Bantuan?</p>
          <p className="text-xs text-gray-400">Hubungi tim support kami kapan saja.</p>
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
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center">
            <LogOut className="h-3.5 w-3.5" />
          </div>
          Keluar (Logout)
        </Link>
      </div>
    </div>
  );
}
