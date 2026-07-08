"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ArrowUpRight, 
  FileText, 
  AlertTriangle, 
  CreditCard,
  UserCheck,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [myInvoices, setMyInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/login"); return; }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "USER") { router.push("/dashboard"); return; }
    setUser(parsedUser);

    Promise.all([
      fetch(`${API_BASE_URL}/api/bookings`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/invoices`).then(res => res.json())
    ])
      .then(([bookingsData, invoicesData]) => {
        // Filter bookings by client's name
        const filteredBookings = bookingsData.filter((b: any) => b.customer === parsedUser.fullname);
        // Filter invoices by client's name
        const filteredInvoices = invoicesData.filter((inv: any) => inv.customerName === parsedUser.fullname);
        
        setMyBookings(filteredBookings);
        setMyInvoices(filteredInvoices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse select-none">
        <div className="h-12 w-12 rounded-full border-4 border-[#e0edea] border-t-[#0d6e6a] animate-spin" />
        <p className="text-sm font-semibold text-[#577b78] tracking-wide">Memuat Dashboard Pemesanan...</p>
      </div>
    );
  }

  const activeBookings = myBookings.filter(b => b.status === "MENUNGGU" || b.status === "TERJADWAL");
  const completedBookings = myBookings.filter(b => b.status === "SELESAI");
  const unpaidInvoices = myInvoices.filter(inv => inv.status !== 'PAID');
  const totalUnpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-16 px-4 md:px-6 select-none">
      
      {/* Upper Navigation / Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs bg-[#0d6e6a]/10 text-[#0d6e6a] border border-[#0d6e6a]/20 font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Dashboard Pemesanan
          </span>
          <h1 className="text-3xl font-black text-[#0d2d2a] tracking-tight mt-2.5">
            Kelola Layanan Servis AC Anda
          </h1>
          <p className="text-[#577b78] text-sm mt-1">
            Pantau status pesanan, jadwal teknisi, dan tagihan Anda di satu tempat.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/client/booking" className="flex-1 md:flex-initial">
            <Button className="w-full h-11 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] text-white hover:opacity-95 rounded-xl font-bold gap-2 shadow-lg shadow-[#0d6e6a]/15 text-sm transition-all hover:scale-[1.02]">
              <Calendar className="h-4.5 w-4.5" />
              Pesan Servis Baru
            </Button>
          </Link>
          <Link href="/client/invoices" className="flex-1 md:flex-initial">
            <Button variant="outline" className="w-full h-11 border-[#e0edea] bg-white text-[#0d6e6a] hover:bg-slate-50 rounded-xl font-bold gap-2 text-sm">
              <FileText className="h-4.5 w-4.5" />
              Lihat Tagihan
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-[2rem] p-8 text-white overflow-hidden shadow-2xl shadow-[#0d6e6a]/10"
        style={{ background: 'linear-gradient(135deg, #0d6e6a 0%, #128a85 50%, #17a29a 100%)' }}>
        
        {/* Glowing glassmorphism details */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl translate-x-1/4 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center border border-white/10">
                <Wrench className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-white/90 uppercase tracking-widest">Dashboard Pemesanan</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Halo, {user?.fullname}! 👋</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Kami siap memberikan pelayanan perbaikan dan cuci AC terbaik dengan teknisi ahli. AC Anda bermasalah? Hubungi kami kapan saja.
            </p>
          </div>

          {unpaidInvoices.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col gap-3 w-full md:w-80 shadow-md">
              <div className="flex items-center gap-2 text-yellow-300">
                <AlertTriangle className="h-4.5 w-4.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Pemberitahuan Tagihan</span>
              </div>
              <div>
                <p className="text-xs text-white/80">Total Tagihan Belum Dibayar</p>
                <p className="text-2xl font-black mt-0.5">Rp {totalUnpaidAmount.toLocaleString('id-ID')}</p>
              </div>
              <Link href="/client/invoices">
                <Button className="w-full h-10 bg-yellow-400 hover:bg-yellow-500 text-[#0d2d2a] font-extrabold text-xs rounded-xl shadow-md gap-1 transition-all">
                  Bayar Sekarang <ArrowUpRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Booking', value: myBookings.length, color: 'text-[#0d6e6a]', bg: 'bg-[#0d6e6a]/5', border: 'border-[#0d6e6a]/15', icon: <FileText className="h-5 w-5 text-[#0d6e6a]" /> },
          { label: 'Booking Aktif', value: activeBookings.length, color: 'text-amber-600', bg: 'bg-amber-500/5', border: 'border-amber-500/15', icon: <Clock className="h-5 w-5 text-amber-500" /> },
          { label: 'Booking Selesai', value: completedBookings.length, color: 'text-emerald-600', bg: 'bg-emerald-500/5', border: 'border-emerald-500/15', icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> },
          { label: 'Tagihan Belum Lunas', value: unpaidInvoices.length, color: unpaidInvoices.length > 0 ? 'text-rose-600' : 'text-slate-500', bg: unpaidInvoices.length > 0 ? 'bg-rose-500/5' : 'bg-slate-500/5', border: unpaidInvoices.length > 0 ? 'border-rose-500/15' : 'border-slate-200', icon: <CreditCard className="h-5 w-5 text-rose-500" /> },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-5 bg-white/70 backdrop-blur-md border ${stat.border} shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-between`}>
            <div>
              <div className="text-xs font-bold text-[#577b78] tracking-wide mb-1">{stat.label}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
            <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Section Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Bookings Section (Left, 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#e0edea]">
            <h3 className="font-extrabold text-lg text-[#0d2d2a] flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#0d6e6a]" />
              Daftar Pesanan Servis AC
            </h3>
            <span className="text-xs font-semibold text-[#577b78] bg-[#e0edea]/40 px-3 py-1 rounded-full">
              {myBookings.length} Total
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-white/50 backdrop-blur-md border border-dashed border-[#e0edea] p-8">
              <Calendar className="h-14 w-14 mx-auto mb-4 text-[#577b78]/40" />
              <h4 className="text-lg font-bold text-[#0d2d2a] mb-1.5">Belum Ada Pesanan</h4>
              <p className="text-xs text-[#577b78] max-w-sm mx-auto leading-relaxed mb-6">
                Anda belum memiliki riwayat pemesanan servis AC. Yuk, buat pemesanan pertama Anda sekarang!
              </p>
              <Link href="/client/booking">
                <Button className="h-10 bg-[#0d6e6a] hover:bg-[#128a85] text-white rounded-xl text-xs font-bold px-5">
                  Pesan Servis Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => {
                const isActive = b.status === "MENUNGGU" || b.status === "TERJADWAL";
                
                // Cari tagihan terkait
                const relatedInvoice = myInvoices.find(inv => inv.bookingCode === b.bookingCode);

                return (
                  <div 
                    key={b.id} 
                    className="rounded-[1.75rem] overflow-hidden bg-white/80 backdrop-blur-md border border-[#e0edea] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Top status bar of the card */}
                    <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-[#e0edea]/55 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0d2d2a] font-mono tracking-tight bg-white border border-[#e0edea] px-2.5 py-1 rounded-lg">
                          {b.bookingCode}
                        </span>
                        <span className="text-[10px] text-[#577b78] font-medium">
                          Dibuat: {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {/* Status badge */}
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                        b.status === 'MENUNGGU' 
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                          : b.status === 'TERJADWAL'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      }`}>
                        {b.status === 'MENUNGGU' ? 'Menunggu Konfirmasi' : b.status === 'TERJADWAL' ? 'Terjadwal' : 'Selesai'}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Complaint & Time */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#577b78] tracking-wider block">Keluhan / Layanan</span>
                          <p className="font-bold text-sm text-[#0d2d2a] leading-snug">{b.complaint}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#577b78] tracking-wider block">Jadwal Kunjungan</span>
                          <p className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-[#128a85] shrink-0" />
                            {new Date(b.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            <span className="text-slate-400">|</span>
                            {b.bookingTime ? b.bookingTime.substring(0, 5) : '-'} WIB
                          </p>
                        </div>
                      </div>

                      {/* Technician assignment info */}
                      <div className="pt-3 border-t border-[#e0edea]/55 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center border border-[#e0edea]/70 shrink-0 text-[#128a85]">
                          <UserCheck className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-xs">
                          {b.technician ? (
                            <p className="text-slate-700">
                              Teknisi: <span className="font-bold text-[#0d2d2a]">{b.technician.fullname}</span> 
                              <span className="text-slate-400 px-1.5">•</span>
                              <span className="text-[#577b78] font-medium">{b.technician.specialty || 'Spesialis AC'}</span>
                            </p>
                          ) : (
                            <p className="text-[#577b78] font-medium italic">
                              Sedang mencari teknisi terbaik untuk kunjungan Anda...
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Invoice Payment Section integration */}
                      {relatedInvoice && (
                        <div className={`mt-4 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border ${
                          relatedInvoice.status === 'PAID'
                            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800'
                            : 'bg-rose-500/5 border-rose-500/10 text-rose-800'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <FileText className={`h-5 w-5 shrink-0 ${relatedInvoice.status === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`} />
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                Invoice: {relatedInvoice.invoiceNumber}
                              </p>
                              <p className="text-[11px] mt-0.5 text-slate-500 font-medium">
                                Total Biaya: <span className="font-extrabold text-slate-800">Rp {relatedInvoice.total.toLocaleString('id-ID')}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {relatedInvoice.status === 'PAID' ? (
                              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100/60 border border-emerald-200/50 px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 select-none">
                                <ShieldCheck className="h-4 w-4" /> Lunas
                              </span>
                            ) : (
                              <>
                                <span className="text-xs font-extrabold text-rose-600 bg-rose-100/60 border border-rose-200/50 px-3 py-1.5 rounded-xl shrink-0 select-none">
                                  Belum Dibayar
                                </span>
                                <Link href={`/pay/${relatedInvoice.id}`}>
                                  <Button size="sm" className="h-9 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:opacity-95 font-bold text-xs gap-1 shadow-sm shrink-0">
                                    Bayar <CreditCard className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Widgets (Right, 1 col) */}
        <div className="space-y-6">
          {/* Quick Categories booking shortcuts */}
          <Card className="border border-[#e0edea] bg-white/70 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-[#e0edea]/60">
              <CardTitle className="text-sm font-extrabold text-[#0d2d2a] flex items-center gap-2">
                <Wrench className="h-4.5 w-4.5 text-[#0d6e6a]" />
                Layanan Cepat
              </CardTitle>
              <CardDescription className="text-[11px] text-[#577b78]">Pilih kategori servis AC terbaik kami.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {[
                { name: 'Cuci AC Berkala', price: 'Rp 75.000', service: 'Cuci AC (Cleaning)' },
                { name: 'Tambah Freon R32', price: 'Rp 150.000', service: 'Isi Freon (R32/R410)' },
                { name: 'Bongkar Pasang AC', price: 'Rp 350.000', service: 'Bongkar Pasang AC' },
                { name: 'Perbaikan AC Bocor/Mati', price: 'Estimasi teknisi', service: 'Perbaikan AC Rusak' }
              ].map((serv, idx) => (
                <div 
                  key={idx}
                  onClick={() => router.push(`/client/booking?service=${encodeURIComponent(serv.service)}`)}
                  className="group flex justify-between items-center p-3 rounded-xl hover:bg-[#0d6e6a]/5 border border-transparent hover:border-[#0d6e6a]/10 transition-all duration-200 cursor-pointer"
                >
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#0d6e6a] transition-colors">{serv.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{serv.price}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0d6e6a] transition-all group-hover:translate-x-0.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Need help support */}
          <div className="bg-[#ebf5f3]/40 border border-[#e0edea] rounded-3xl p-6 text-center space-y-4">
            <h4 className="font-bold text-sm text-[#0d2d2a]">Butuh Bantuan Mendesak?</h4>
            <p className="text-xs text-[#577b78] leading-relaxed">
              Jika Anda memiliki kendala AC yang butuh penanganan segera, silakan hubungi tim Customer Service kami lewat WhatsApp.
            </p>
            <Link href="https://wa.me/628123456789" target="_blank">
              <Button className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                Hubungi Customer Service
              </Button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
