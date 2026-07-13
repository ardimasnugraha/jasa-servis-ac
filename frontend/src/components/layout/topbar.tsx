'use client';
import { API_BASE_URL } from "@/config";

import { Bell, Search, ChevronDown, LogOut, Settings, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<{ fullname?: string; email?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const fetchNotifications = (isInitial = false) => {
    fetch(`${API_BASE_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pending = data.filter((b: any) => b.status === "MENUNGGU" || b.status === "PENDING");
          setNotifications(prev => {
            if (pending.length > prev.length || (isInitial && pending.length > 0)) {
              setHasUnread(true);
            }
            return pending;
          });
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    fetchNotifications(true);
    const interval = setInterval(() => fetchNotifications(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const initials = user?.fullname
    ? user.fullname.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 px-4 md:px-5 relative bg-white/60 backdrop-blur-md border-b border-black/[0.05]">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 md:hidden flex-shrink-0"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            type="search"
            placeholder="Cari pelanggan, booking, invoice..."
            className="w-full pl-8 pr-4 h-8 rounded-xl text-xs border border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900 bg-gray-50/80 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setHasUnread(false);
            }}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 relative"
          >
            <Bell className="h-4 w-4" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-xl p-3.5 shadow-xl shadow-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-2.5">
                  <h4 className="font-bold text-xs text-gray-900">Notifikasi Booking Baru</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                    {notifications.length} Menunggu
                  </span>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    Tidak ada pesanan baru yang menunggu.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {notifications.map((b) => (
                      <Link
                        key={b.id}
                        href="/bookings"
                        onClick={() => setNotifOpen(false)}
                        className="block p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-xs"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-gray-900">{b.customer}</span>
                          <span className="font-mono text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
                            {b.bookingCode || 'BKG-???'}
                          </span>
                        </div>
                        <p className="text-gray-500 truncate italic">&quot;{b.complaint}&quot;</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Jadwal: {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("id-ID") : '—'}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-5 w-px mx-0.5 bg-gray-200" />

        {/* User profile with dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <Avatar className="h-7 w-7 ring-1 ring-gray-200">
              <AvatarImage src="" alt={user?.fullname || 'Admin'} />
              <AvatarFallback className="text-[10px] font-bold text-white bg-gray-900">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-semibold leading-none text-gray-900">
                {user?.fullname || 'Admin'}
              </span>
              <span className="text-[10px] mt-0.5 text-gray-400">
                {user?.email || 'admin@crm.com'}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 ml-0.5 text-gray-400 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur-xl p-1.5 shadow-xl shadow-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Pengaturan</span>
                </Link>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    }
                  }}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
