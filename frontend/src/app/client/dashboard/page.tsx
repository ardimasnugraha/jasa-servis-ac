"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Wrench, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/login"); return; }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "USER") { router.push("/dashboard"); return; }
    setUser(parsedUser);

    fetch(`${API_BASE_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((b: any) => b.customer === parsedUser.fullname);
        setMyBookings(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.62 0.20 175)', borderRightColor: 'oklch(0.60 0.22 264)' }} />
      </div>
    );
  }

  const activeBookings = myBookings.filter(b => b.status === "MENUNGGU" || b.status === "TERJADWAL");
  const completedBookings = myBookings.filter(b => b.status === "SELESAI");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10 select-none">

      {/* Hero Welcome Banner */}
      <div className="relative rounded-[2.5rem] p-8 text-white overflow-hidden shadow-xl shadow-[#0d6e6a]/10"
        style={{ background: 'linear-gradient(135deg, #0d6e6a 0%, #128a85 50%, #1bb2aa 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Portal Pelanggan</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Halo, {user?.fullname}! 👋</h1>
          <p className="text-white/80 max-w-lg text-sm mb-6 leading-relaxed">
            Selamat datang di Portal Pelanggan AC KITA. Kami siap menjaga AC Anda tetap dingin dan bekerja dengan optimal.
          </p>
          <Link href="/client/booking">
            <Button className="gap-2 font-bold rounded-xl h-11 px-6 bg-white hover:bg-white/95 text-[#0d6e6a] shadow-md transition-all">
              <Calendar className="h-4 w-4" />
              Pesan Servis Sekarang
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Pesanan', value: myBookings.length, color: 'text-[#0d6e6a]', bg: 'bg-[#0d6e6a]/5' },
          { label: 'Pesanan Aktif', value: activeBookings.length, color: 'text-amber-600', bg: 'bg-amber-500/5' },
          { label: 'Selesai Diservis', value: completedBookings.length, color: 'text-emerald-600', bg: 'bg-emerald-500/5' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-5 text-center bg-white/70 backdrop-blur-xl border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)]`}>
            <div className={`text-3xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs font-semibold text-[#577b78]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bookings grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Active */}
        <div className="rounded-[2rem] overflow-hidden shadow-xl shadow-[#0d6e6a]/5 bg-white/70 backdrop-blur-xl border border-[#e0edea]">
          <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500" />
          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="h-9 w-9 rounded-xl flex items-center justify-center bg-amber-500/10">
                <Clock className="h-4.5 w-4.5 text-amber-500" />
              </span>
              <div>
                <h2 className="font-bold text-sm text-[#0d2d2a]">Pesanan Aktif</h2>
                <p className="text-xs text-[#577b78]">Jadwal teknisi mendatang</p>
              </div>
            </div>
            {activeBookings.length === 0 ? (
              <div className="py-8 text-center rounded-xl bg-muted/40 border border-dashed border-[#e0edea]">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#577b78]" />
                <p className="text-xs font-medium text-[#577b78]">Belum ada jadwal aktif.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeBookings.map(b => (
                  <div key={b.id} className="flex justify-between items-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div>
                      <p className="font-semibold text-sm text-[#0d2d2a]">{b.complaint}</p>
                      <p className="text-xs mt-1 flex items-center gap-1.5 text-[#577b78]">
                        <Calendar className="h-3 w-3" />
                        {new Date(b.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 uppercase">
                      {b.status === 'MENUNGGU' ? 'Menunggu' : 'Terjadwal'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-[2rem] overflow-hidden shadow-xl shadow-[#0d6e6a]/5 bg-white/70 backdrop-blur-xl border border-[#e0edea]">
          <div className="h-1.5 bg-gradient-to-r from-[#0d6e6a] to-[#128a85]" />
          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="h-9 w-9 rounded-xl flex items-center justify-center bg-[#0d6e6a]/10">
                <CheckCircle className="h-4.5 w-4.5 text-[#0d6e6a]" />
              </span>
              <div>
                <h2 className="font-bold text-sm text-[#0d2d2a]">Riwayat Servis</h2>
                <p className="text-xs text-[#577b78]">Pekerjaan yang telah selesai</p>
              </div>
            </div>
            {completedBookings.length === 0 ? (
              <div className="py-8 text-center rounded-xl bg-muted/40 border border-dashed border-[#e0edea]">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#577b78]" />
                <p className="text-xs font-medium text-[#577b78]">Belum ada riwayat servis.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedBookings.slice(0, 3).map(b => (
                  <div key={b.id} className="flex justify-between items-center p-4 rounded-xl bg-[#0d6e6a]/5 border border-[#0d6e6a]/10">
                    <div>
                      <p className="font-semibold text-sm text-[#0d2d2a]">{b.complaint}</p>
                      <p className="text-xs mt-1 text-[#577b78]">
                        {new Date(b.bookingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0d6e6a]/10 text-[#0d6e6a] uppercase">
                      Selesai ✓
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
