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
    <header className="flex h-16 shrink-0 items-center gap-3 px-4 md:px-6 relative"
      style={{
        background: 'transparent',
        borderBottom: '1px solid rgba(13, 110, 106, 0.08)',
      }}
    >
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="h-9 w-9 rounded-xl hover:bg-[#0d6e6a]/5 text-[#417874] hover:text-[#0d2d2a] md:hidden flex-shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#577b78' }} />
          <Input
            type="search"
            placeholder="Cari pelanggan, booking, invoice..."
            className="w-full pl-9 pr-4 h-9 rounded-xl text-sm border border-[#e0edea] focus-visible:ring-1 focus-visible:ring-[#0d6e6a]"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              color: '#0d2d2a',
            }}
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setHasUnread(false);
            }}
            className="h-9 w-9 rounded-xl hover:bg-[#0d6e6a]/5 text-[#417874] hover:text-[#0d2d2a] relative"
          >
            <Bell className="h-4 w-4" />
            {hasUnread && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </Button>

          {notifOpen && (
            <>
              {/* Click outside overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              
              {/* Notifications Dropdown */}
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#e0edea] bg-white p-3.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-[#e0edea] pb-2.5 mb-2.5">
                  <h4 className="font-bold text-xs text-[#0d2d2a]">Notifikasi Booking Baru</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">
                    {notifications.length} Menunggu
                  </span>
                </div>
                
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#577b78]">
                    Tidak ada pesanan baru yang menunggu.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {notifications.map((b) => (
                      <Link 
                        key={b.id}
                        href="/bookings"
                        onClick={() => setNotifOpen(false)}
                        className="block p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all text-xs"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-[#0d2d2a]">{b.customer}</span>
                          <span className="font-mono text-[9px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                            {b.bookingCode || 'BKG-???'}
                          </span>
                        </div>
                        <p className="text-[#577b78] truncate italic">"{b.complaint}"</p>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
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
        <div className="h-6 w-px mx-1 bg-[#e0edea]" />

        {/* User profile with dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-[#0d6e6a]/5 transition-colors"
          >
            <Avatar className="h-8 w-8 ring-2" style={{ '--tw-ring-color': 'oklch(0.45 0.14 185 / 0.4)' } as React.CSSProperties}>
              <AvatarImage src="" alt={user?.fullname || 'Admin'} />
              <AvatarFallback
                className="text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, oklch(0.45 0.14 185), oklch(0.55 0.18 200))' }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-semibold leading-none text-[#0d2d2a]">
                {user?.fullname || 'Admin'}
              </span>
              <span className="text-xs mt-0.5 text-[#577b78]">
                {user?.email || 'admin@crm.com'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 ml-1 text-[#577b78] transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {dropdownOpen && (
            <>
              {/* Click outside overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#e0edea] bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm text-[#417874] hover:bg-[#0d6e6a]/5 hover:text-[#0d2d2a] transition-all"
                >
                  <Settings className="h-4 w-4" />
                  <span>Pengaturan</span>
                </Link>
                <div className="h-px bg-[#e0edea] my-1" />
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    }
                  }}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-all font-medium"
                >
                  <LogOut className="h-4 w-4" />
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
