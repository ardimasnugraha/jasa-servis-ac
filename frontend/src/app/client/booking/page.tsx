"use client";
import { API_BASE_URL } from "@/config";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, CalendarCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ClientBookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  
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
      .then(data => setTechnicians(data))
      .catch(err => console.error(err));
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12 relative select-none">
      {/* Background Glow */}
      <div className="absolute top-10 right-0 w-72 h-72 bg-[#0d6e6a]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-[#ebdff7]/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-8">
        <Link href="/client/dashboard">
          <Button variant="ghost" size="icon" className="rounded-2xl bg-[#0d6e6a]/5 border border-[#e0edea] hover:bg-[#0d6e6a]/10 text-[#0d6e6a] h-11 w-11 flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0d2d2a] flex items-center gap-2">
            Pesan Teknisi <Sparkles className="h-5 w-5 text-[#128a85]" />
          </h1>
          <p className="text-[#577b78] mt-1 text-sm">Jadwalkan perbaikan atau perawatan AC Anda dengan mudah.</p>
        </div>
      </div>

      <Card className="border border-[#e0edea] bg-white/70 backdrop-blur-xl shadow-xl shadow-[#0d6e6a]/5 rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0d6e6a] via-[#128a85] to-[#ebdff7]"></div>
        <CardHeader className="bg-[#ebf5f3]/20 pb-6 border-b border-[#e0edea]/60 pt-8 px-8">
          <CardTitle className="text-2xl font-bold flex items-center text-[#0d2d2a]">
            <div className="h-11 w-11 bg-[#0d6e6a]/10 rounded-2xl flex items-center justify-center mr-4 border border-[#0d6e6a]/10">
              <CalendarCheck className="h-5 w-5 text-[#0d6e6a]" />
            </div>
            Formulir Pemesanan
          </CardTitle>
          <CardDescription className="text-[#577b78] text-sm mt-1.5 ml-15">
            Silakan lengkapi detail masalah AC Anda di bawah ini agar kami dapat memberikan layanan terbaik.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="complaint" className="text-[#417874] font-semibold text-sm">Detail Masalah / Keluhan</Label>
              <Input
                id="complaint"
                placeholder="Contoh: AC kurang dingin, cuci rutin, atau air menetes..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
                className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/40 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white/80"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[#417874] font-semibold text-sm">Pilih Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white/80 [color-scheme:light]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-[#417874] font-semibold text-sm">Pilih Waktu</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white/80 [color-scheme:light]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[#417874] font-semibold text-sm">Pilih Teknisi Langganan Anda (Opsional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Option: Let Admin Choose */}
                <div 
                  onClick={() => setTechnicianId("")}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center gap-3 bg-white/50 ${
                    !technicianId || technicianId === "" || technicianId === "none"
                      ? 'border-[#0d6e6a] bg-[#ebf5f3]/30 shadow-md ring-1 ring-[#0d6e6a]/20'
                      : 'border-[#e0edea] hover:border-[#0d6e6a]/50 hover:bg-white'
                  }`}
                >
                  <div className="h-10 w-10 rounded-xl bg-[#0d6e6a]/10 flex items-center justify-center text-[#0d6e6a] flex-shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-[#0d2d2a] truncate">Pilihan Otomatis</h5>
                    <p className="text-[10px] text-[#577b78] mt-0.5">Admin akan memilihkan ahli terbaik</p>
                  </div>
                </div>

                {/* Technician Cards */}
                {technicians.map((t, idx) => {
                  const isSelected = technicianId === t.id;
                  const colors = [
                    'bg-[#0d6e6a] text-white',
                    'bg-indigo-600 text-white',
                    'bg-violet-600 text-white',
                    'bg-emerald-600 text-white'
                  ];
                  const avatarColor = colors[idx % colors.length];

                  return (
                    <div 
                      key={t.id}
                      onClick={() => setTechnicianId(t.id)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex items-center gap-3 bg-white/50 ${
                        isSelected
                          ? 'border-[#0d6e6a] bg-[#ebf5f3]/30 shadow-md ring-1 ring-[#0d6e6a]/20'
                          : 'border-[#e0edea] hover:border-[#0d6e6a]/50 hover:bg-white'
                      }`}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className={`text-xs font-bold ${avatarColor}`}>
                          {(t.fullname || 'TK').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-[#0d2d2a] truncate">{t.fullname}</h5>
                        <p className="text-[10px] text-[#577b78] mt-0.5 truncate">Spesialis: {t.specialty || 'Umum'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-sm font-bold bg-gradient-to-r from-[#0d6e6a] to-[#128a85] text-white shadow-lg shadow-[#0d6e6a]/15 hover:opacity-95 transition-all rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses Pesanan...</>
                ) : (
                  "Kirim Permintaan Servis"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
