"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [myInvoices, setMyInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = (parsedUser: any) => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/bookings`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/invoices`).then(res => res.json())
    ])
      .then(([bookingsData, invoicesData]) => {
        const filteredBookings = bookingsData.filter((b: any) => 
          parsedUser.customerId ? b.customerId === parsedUser.customerId : b.customer === parsedUser.fullname
        );
        const filteredInvoices = invoicesData.filter((inv: any) => 
          parsedUser.customerId ? inv.customerId === parsedUser.customerId : inv.customerName === parsedUser.fullname
        );
        setMyBookings(filteredBookings);
        setMyInvoices(filteredInvoices);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (!confirm("Apakah Anda yakin pekerjaan oleh teknisi ini sudah selesai?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SELESAI" }),
      });
      if (!response.ok) throw new Error();
      alert("Pekerjaan telah ditandai Selesai!");
      
      // Update local state by reloading data
      let userData = localStorage.getItem("user");
      if (userData) {
        fetchDashboardData(JSON.parse(userData));
      } else {
        window.location.reload();
      }
    } catch (e) {
      alert("Gagal memperbarui status pekerjaan.");
    }
  };

  useEffect(() => {
    let userData = null;
    try {
      userData = localStorage.getItem("user");
    } catch (e) {
      console.error(e);
    }
    if (!userData) { router.push("/login"); return; }
    
    let parsedUser = null;
    try {
      parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "USER") { router.push("/dashboard"); return; }
      setUser(parsedUser);
      fetchDashboardData(parsedUser);
    } catch (e) {
      console.error(e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 select-none">
        <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
        <p className="text-xs font-semibold text-gray-400 tracking-wide">Memuat Dashboard...</p>
      </div>
    );
  }

  const activeBookings = myBookings.filter(b => b.status === "MENUNGGU" || b.status === "TERJADWAL");
  const completedBookings = myBookings.filter(b => b.status === "SELESAI");
  const unpaidInvoices = myInvoices.filter(inv => inv.status !== 'PAID');
  const totalUnpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-16 px-4 md:px-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
        <div>
          <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Dashboard Pemesanan
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
            Kelola Layanan Jasa Servis Anda
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Pantau status pesanan, jadwal teknisi, dan tagihan Anda di satu tempat.
          </p>
        </div>

        <div className="flex gap-2.5 w-full md:w-auto">
          <Link href="/client/booking" className="flex-1 md:flex-initial">
            <Button className="w-full h-10 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-bold gap-2 text-xs transition-all hover:scale-[1.02]">
              <Calendar className="h-4 w-4" />
              Pesan Servis Baru
            </Button>
          </Link>
          <Link href="/client/invoices" className="flex-1 md:flex-initial">
            <Button variant="outline" className="w-full h-10 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl font-bold gap-2 text-xs">
              <FileText className="h-4 w-4" />
              Lihat Tagihan
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-black/8 bg-gray-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl translate-x-1/4 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-white/3 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                <Wrench className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Dashboard Pemesanan</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Halo, {user?.fullname}! 👋</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Kami siap memberikan pelayanan perbaikan dan servis terbaik dengan teknisi ahli. Peralatan Anda bermasalah? Hubungi kami kapan saja.
            </p>
          </div>

          {unpaidInvoices.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 flex flex-col gap-3 w-full md:w-72">
              <div className="flex items-center gap-2 text-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Tagihan Belum Dibayar</span>
              </div>
              <div>
                <p className="text-xs text-white/60">Total Tagihan</p>
                <p className="text-xl font-black mt-0.5">Rp {totalUnpaidAmount.toLocaleString('id-ID')}</p>
              </div>
              <Link href="/client/invoices">
                <Button className="w-full h-9 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded-lg gap-1 transition-all">
                  Bayar Sekarang <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Booking', value: myBookings.length, icon: <FileText className="h-4 w-4 text-gray-600" />, accent: 'text-gray-900' },
          { label: 'Booking Aktif', value: activeBookings.length, icon: <Clock className="h-4 w-4 text-amber-500" />, accent: 'text-amber-600' },
          { label: 'Booking Selesai', value: completedBookings.length, icon: <CheckCircle2 className="h-4 w-4 text-gray-600" />, accent: 'text-gray-900' },
          { label: 'Tagihan Belum Lunas', value: unpaidInvoices.length, icon: <CreditCard className="h-4 w-4 text-red-500" />, accent: unpaidInvoices.length > 0 ? 'text-red-600' : 'text-gray-900' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wide mb-1">{stat.label}</div>
              <div className={`text-2xl font-black ${stat.accent}`}>{stat.value}</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Section Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Bookings Section (Left, 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Wrench className="h-4.5 w-4.5 text-gray-400" />
              Daftar Pesanan Servis
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {myBookings.length} Total
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/60 backdrop-blur-sm border border-dashed border-gray-200 p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h4 className="text-base font-bold text-gray-900 mb-1.5">Belum Ada Pesanan</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mb-5">
                Anda belum memiliki riwayat pemesanan servis. Yuk, buat pemesanan pertama Anda sekarang!
              </p>
              <Link href="/client/booking">
                <Button className="h-9 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold px-5">
                  Pesan Servis Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.map((b) => {
                const relatedInvoice = myInvoices.find(inv => inv.bookingCode === b.bookingCode);

                const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
                  MENUNGGU:  { label: 'Menunggu Konfirmasi', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/60' },
                  TERJADWAL: { label: 'Terjadwal', color: 'text-gray-700', bg: 'bg-gray-100 border-gray-200/60' },
                  SELESAI:   { label: 'Selesai', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200/60' },
                };
                const sc = statusConfig[b.status] || { label: b.status, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200/60' };

                return (
                  <div 
                    key={b.id} 
                    className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="px-5 py-3.5 flex flex-wrap justify-between items-center gap-3 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 font-mono tracking-tight bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
                          {b.bookingCode}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Keluhan / Layanan</span>
                          <p className="font-bold text-sm text-gray-900 leading-snug">{b.complaint}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Jadwal Kunjungan</span>
                          <p className="font-bold text-sm text-gray-700 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            {new Date(b.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                            <span className="text-gray-300">|</span>
                            {b.bookingTime ? (b.bookingTime.length <= 8 ? b.bookingTime.substring(0, 5) : new Date(b.bookingTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })) : '-'} WIB
                          </p>
                        </div>
                      </div>

                      {/* Technician */}
                      <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <UserCheck className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="text-xs flex-1">
                          {b.technician ? (
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="text-gray-700">
                                Teknisi: <span className="font-bold text-gray-900">{b.technician.fullname}</span>
                                <span className="text-gray-300 px-1.5">•</span>
                                <span className="text-gray-400 font-medium">{b.technician.specialty || 'Spesialis Servis'}</span>
                              </p>
                              {b.status === "TERJADWAL" && (
                                <Button 
                                  onClick={() => handleCompleteBooking(b.id)}
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] gap-1 h-8 px-3 cursor-pointer shadow-sm ml-auto"
                                >
                                  <CheckCircle2 className="h-3 w-3" /> Selesai
                                </Button>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-400 font-medium italic">Sedang mencari teknisi terbaik untuk kunjungan Anda...</p>
                          )}
                        </div>
                      </div>

                      {/* Invoice */}
                      {relatedInvoice && (
                        <div className={`mt-2 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border ${
                          relatedInvoice.status === 'PAID'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-red-50/50 border-red-200/40'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <FileText className={`h-4 w-4 shrink-0 ${relatedInvoice.status === 'PAID' ? 'text-gray-400' : 'text-red-400'}`} />
                            <div>
                              <p className="text-xs font-bold text-gray-800">Invoice: {relatedInvoice.invoiceNumber}</p>
                              <p className="text-[10px] mt-0.5 text-gray-400">
                                Total: <span className="font-extrabold text-gray-800">Rp {relatedInvoice.total.toLocaleString('id-ID')}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {relatedInvoice.status === 'PAID' ? (
                              <span className="text-xs font-extrabold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5" /> Lunas
                              </span>
                            ) : (
                              <>
                                <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200/50 px-3 py-1.5 rounded-lg">
                                  Belum Dibayar
                                </span>
                                <Link href={`/pay/${relatedInvoice.id}`}>
                                  <Button size="sm" className="h-8 px-3.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold text-xs gap-1">
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

        {/* Sidebar Widgets */}
        <div className="space-y-4">
          {/* Need help support */}
          <Card className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-gray-900">Butuh Bantuan Mendesak?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Jika Anda memiliki kendala yang butuh penanganan segera, silakan hubungi tim Customer Service kami lewat WhatsApp.
              </p>
              <Link href="https://wa.me/628123456789" target="_blank">
                <Button className="w-full h-9 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs shadow-sm">
                  Hubungi Customer Service
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
