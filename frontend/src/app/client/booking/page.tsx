"use client";
import { API_BASE_URL } from "@/config";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Calendar, Clock, Wrench, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ClientBookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [technicianId, setTechnicianId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      const currentSearch = window.location.search;
      router.push(`/login?redirect=/client/booking${currentSearch}`);
      return;
    }
    setUser(JSON.parse(userData));

    const searchParams = new URLSearchParams(window.location.search);
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setComplaint(serviceParam);
    }

    fetch(`${API_BASE_URL}/api/technicians`)
      .then(res => res.json())
      .then(data => {
        setTechnicians(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading technicians:", err);
        setLoading(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.customerId, 
          technicianId: (technicianId && technicianId !== "none" && technicianId !== "") ? technicianId : null,
          bookingDate,
          bookingTime,
          complaint,
        }),
      });

      if (!response.ok) throw new Error("Gagal memesan servis");

      alert("Pemesanan berhasil! Teknisi kami akan segera menghubungi Anda.");
      router.push("/client/dashboard");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse select-none">
        <div className="h-12 w-12 rounded-full border-4 border-[#e0edea] border-t-[#0d6e6a] animate-spin" />
        <p className="text-sm font-semibold text-[#577b78] tracking-wide">Menyiapkan formulir pemesanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-16 px-4 md:px-6 select-none">
      
      {/* Header and Back navigation */}
      <div className="flex items-center gap-4 mb-4">
        <Link href="/client/dashboard">
          <Button variant="ghost" size="icon" className="rounded-2xl bg-[#0d6e6a]/5 border border-[#e0edea] hover:bg-[#0d6e6a]/10 text-[#0d6e6a] h-11 w-11 flex items-center justify-center transition-all duration-200">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <span className="text-xs bg-[#0d6e6a]/10 text-[#0d6e6a] border border-[#0d6e6a]/20 font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Dashboard Pemesanan
          </span>
          <h1 className="text-3xl font-black text-[#0d2d2a] tracking-tight mt-2.5 flex items-center gap-2">
            Pesan Teknisi AC <Sparkles className="h-5 w-5 text-[#128a85]" />
          </h1>
          <p className="text-[#577b78] text-sm mt-1">Jadwalkan perbaikan atau perawatan AC Anda dengan mudah dan cepat.</p>
        </div>
      </div>

      {/* Main card containing booking form */}
      <Card className="border border-[#e0edea] bg-white/80 backdrop-blur-xl shadow-xl shadow-[#0d6e6a]/4 rounded-[2rem] overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0d6e6a] via-[#128a85] to-[#ebdff7]"></div>
        
        <CardHeader className="bg-[#ebf5f3]/10 pb-6 border-b border-[#e0edea]/60 pt-8 px-8">
          <CardTitle className="text-xl font-extrabold flex items-center text-[#0d2d2a] gap-2">
            <Wrench className="h-5.5 w-5.5 text-[#0d6e6a]" />
            Formulir Pemesanan Servis
          </CardTitle>
          <CardDescription className="text-[#577b78] text-xs">
            Lengkapi detail masalah AC dan atur jadwal kunjungan sesuai ketersediaan waktu Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input detail keluhan */}
            <div className="space-y-2.5">
              <Label htmlFor="complaint" className="text-[#417874] font-bold text-sm">Detail Masalah / Keluhan</Label>
              <Input
                id="complaint"
                placeholder="Contoh: AC kurang dingin, bocor air, atau cuci AC berkala..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
                className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/40 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white/90"
              />
            </div>

            {/* Input Tanggal & Waktu */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="date" className="text-[#417874] font-bold text-sm flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#0d6e6a] shrink-0" />
                  Pilih Tanggal
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white/90 [color-scheme:light]"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="time" className="text-[#417874] font-bold text-sm flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#0d6e6a] shrink-0" />
                  Pilih Waktu
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white/90 [color-scheme:light]"
                />
              </div>
            </div>

            {/* Pemilihan Teknisi */}
            <div className="space-y-3.5 pt-2">
              <div className="flex flex-col gap-0.5">
                <Label className="text-[#417874] font-bold text-sm">Pilih Teknisi Langganan (Opsional)</Label>
                <p className="text-[11px] text-[#577b78] font-medium">Anda bisa membiarkan admin memilihkan teknisi terbaik untuk kunjungan Anda.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Opsi default: Pilihan Otomatis */}
                <div 
                  onClick={() => setTechnicianId("")}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex items-center gap-3.5 bg-white/40 ${
                    !technicianId || technicianId === ""
                      ? 'border-[#0d6e6a] bg-[#ebf5f3]/45 shadow-md shadow-[#0d6e6a]/4 scale-[1.01]'
                      : 'border-[#e0edea] hover:border-[#0d6e6a]/50 hover:bg-white/80'
                  }`}
                >
                  <div className="h-10 w-10 rounded-xl bg-[#0d6e6a]/10 flex items-center justify-center text-[#0d6e6a] flex-shrink-0">
                    <Sparkles className="h-5.5 w-5.5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-xs text-[#0d2d2a] truncate">Pilihan Otomatis</h5>
                    <p className="text-[10px] text-[#577b78] mt-0.5 font-semibold">Ahli terbaik dari tim kami</p>
                  </div>
                </div>

                {/* List Kartu Teknisi */}
                {technicians.map((t, idx) => {
                  const isSelected = technicianId === t.id;
                  const colors = [
                    'bg-[#0d6e6a] text-white',
                    'bg-indigo-600 text-white',
                    'bg-violet-600 text-white',
                    'bg-teal-600 text-white',
                  ];
                  const avatarColor = colors[idx % colors.length];

                  return (
                    <div 
                      key={t.id}
                      onClick={() => setTechnicianId(t.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex items-center gap-3.5 bg-white/40 ${
                        isSelected
                          ? 'border-[#0d6e6a] bg-[#ebf5f3]/45 shadow-md shadow-[#0d6e6a]/4 scale-[1.01]'
                          : 'border-[#e0edea] hover:border-[#0d6e6a]/50 hover:bg-white/80'
                      }`}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0 border border-slate-100 shadow-sm">
                        <AvatarFallback className={`text-xs font-black ${avatarColor}`}>
                          {(t.fullname || 'TK').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h5 className="font-extrabold text-xs text-[#0d2d2a] truncate">{t.fullname}</h5>
                        <p className="text-[10px] text-[#577b78] mt-0.5 truncate font-semibold">Spesialis: {t.specialty || 'General'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Aksi submit */}
            <div className="pt-6 border-t border-[#e0edea]/60">
              <Button 
                type="submit" 
                className="w-full h-12 text-sm font-extrabold bg-gradient-to-r from-[#0d6e6a] to-[#128a85] text-white shadow-lg shadow-[#0d6e6a]/15 hover:opacity-95 hover:scale-[1.005] transition-all rounded-xl gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" /> Memproses Pemesanan...</>
                ) : (
                  "Kirim Permintaan Servis"
                )}
              </Button>
            </div>

            {/* Catatan garansi */}
            <div className="bg-[#ebf5f3]/25 rounded-2xl p-4 flex items-start gap-3 border border-[#e0edea]/55">
              <AlertCircle className="h-5 w-5 text-[#128a85] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#577b78] leading-relaxed">
                <span className="font-bold text-[#0d2d2a]">Catatan Layanan:</span> Semua pengerjaan servis AC didukung oleh garansi kualitas kerja selama 30 hari. Jadwal kunjungan teknisi akan disesuaikan dan dikonfirmasi kembali oleh admin.
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
