"use client";
import { API_BASE_URL } from "@/config";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Calendar, Clock, Wrench, Sparkles, AlertCircle, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const QUICK_SUGGESTIONS = [
  "Cuci AC (Cleaning)",
  "Tambah Freon R32",
  "Bongkar Pasang AC",
  "Perbaikan AC Rusak / Bocor",
  "Perbaikan AC Mati Total",
  "AC Berisik / Mengeluarkan Bau"
];

const TIME_SLOTS = [
  { label: "Pagi (08:00 - 12:00)", value: "09:00" },
  { label: "Siang (12:00 - 15:00)", value: "13:00" },
  { label: "Sore (15:00 - 18:00)", value: "16:00" },
];

export default function ClientBookingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(1);
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
            Pesan dan Sewa Teknisi <Sparkles className="h-5 w-5 text-[#128a85]" />
          </h1>
          <p className="text-[#577b78] text-sm mt-1">Jadwalkan perbaikan atau perawatan Anda dengan mudah dan cepat.</p>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="mb-8 select-none">
        <div className="flex items-center justify-between relative max-w-md mx-auto px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#e0edea] z-0"></div>
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] transition-all duration-500 z-0" 
            style={{ width: `${((step - 1) / 2) * 88}%` }}
          ></div>
          
          {[
            { label: "Keluhan", stepNum: 1 },
            { label: "Jadwal", stepNum: 2 },
            { label: "Teknisi", stepNum: 3 }
          ].map((s) => (
            <div key={s.stepNum} className="flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => {
                  if (s.stepNum === 1) setStep(1);
                  else if (s.stepNum === 2 && complaint.trim() !== "") setStep(2);
                  else if (s.stepNum === 3 && complaint.trim() !== "" && bookingDate && bookingTime) setStep(3);
                }}
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                  step >= s.stepNum
                    ? "bg-[#0d6e6a] text-white border-[#0d6e6a] shadow-md shadow-[#0d6e6a]/20 scale-105"
                    : "bg-white text-[#577b78] border-[#e0edea]"
                }`}
              >
                {step > s.stepNum ? <Check className="h-4 w-4 stroke-[3]" /> : s.stepNum}
              </button>
              <span className={`text-[10px] font-bold mt-2 tracking-wide uppercase ${step >= s.stepNum ? "text-[#0d2d2a]" : "text-[#577b78]/60"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main card containing booking form */}
      <Card className="border border-[#e0edea] bg-white/80 backdrop-blur-xl shadow-xl shadow-[#0d6e6a]/4 rounded-[2rem] overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0d6e6a] via-[#128a85] to-[#ebdff7]"></div>
        
        <CardHeader className="bg-[#ebf5f3]/10 pb-6 border-b border-[#e0edea]/60 pt-8 px-8">
          <CardTitle className="text-xl font-extrabold flex items-center text-[#0d2d2a] gap-2">
            <Wrench className="h-5.5 w-5.5 text-[#0d6e6a]" />
            Formulir Pemesanan Jasa Servis
          </CardTitle>
          <CardDescription className="text-[#577b78] text-xs">
            Langkah {step} dari 3: {step === 1 ? "Jelaskan permasalahan Anda" : step === 2 ? "Pilih tanggal dan waktu kunjungan" : "Pilih teknisi pilihan Anda & konfirmasi"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Langkah 1: Detail Keluhan */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2.5">
                  <Label htmlFor="complaint" className="text-[#417874] font-bold text-sm">Detail Masalah / Keluhan</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Jelaskan kendala Anda secara detail agar teknisi kami dapat mempersiapkan peralatan yang tepat (contoh: AC kurang dingin, bocor air, atau cuci AC berkala...)"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    required
                    rows={4}
                    className="min-h-[120px] bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/40 rounded-xl focus-visible:ring-[#0d6e6a] text-sm p-4 transition-all hover:bg-white/90 focus:border-[#0d6e6a]/50"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-xs text-[#577b78] font-bold tracking-wide uppercase">Rekomendasi Layanan</span>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setComplaint(suggestion)}
                        className={`text-xs px-3.5 py-2 rounded-xl border transition-all duration-200 font-semibold ${
                          complaint === suggestion
                            ? "bg-[#0d6e6a]/10 border-[#0d6e6a] text-[#0d6e6a] font-bold shadow-sm"
                            : "bg-white border-[#e0edea] text-[#577b78] hover:border-[#0d6e6a]/40 hover:text-[#0d6e6a]"
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e0edea]/60 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={complaint.trim() === ""}
                    className="h-11 px-6 text-xs font-bold bg-[#0d6e6a] hover:bg-[#0d6e6a]/90 text-white rounded-xl gap-2 shadow-md shadow-[#0d6e6a]/15 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjut ke Jadwal <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Langkah 2: Atur Jadwal */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="date" className="text-[#417874] font-bold text-sm flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#0d6e6a] shrink-0" />
                      Pilih Tanggal Kunjungan
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white focus:border-[#0d6e6a]/50 [color-scheme:light]"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="time" className="text-[#417874] font-bold text-sm flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#0d6e6a] shrink-0" />
                      Pilih Waktu Kunjungan
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className="h-12 bg-white/50 border-[#e0edea] text-[#0d2d2a] rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4 transition-all hover:bg-white focus:border-[#0d6e6a]/50 [color-scheme:light]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs text-[#577b78] font-bold tracking-wide uppercase">Pilih Jam Cepat</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = bookingTime === slot.value;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setBookingTime(slot.value)}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all duration-300 ${
                            isSelected
                              ? "bg-[#ebf5f3]/45 border-[#0d6e6a] text-[#0d6e6a] font-bold scale-[1.01]"
                              : "bg-white border-[#e0edea] text-[#577b78] hover:border-[#0d6e6a]/40"
                          }`}
                        >
                          <span className="text-xs font-semibold">{slot.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e0edea]/60 flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-11 px-5 text-xs font-bold bg-white border border-[#e0edea] text-[#0d6e6a] hover:bg-[#ebf5f3]/30 rounded-xl gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Kembali
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!bookingDate || !bookingTime}
                    className="h-11 px-6 text-xs font-bold bg-[#0d6e6a] hover:bg-[#0d6e6a]/90 text-white rounded-xl gap-2 shadow-md shadow-[#0d6e6a]/15 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lanjut ke Teknisi <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Langkah 3: Pilih Teknisi & Kirim */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-3.5">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-[#417874] font-bold text-sm">Pilih Teknisi Langganan (Opsional)</Label>
                    <p className="text-[11px] text-[#577b78] font-medium">Anda bisa membiarkan admin memilihkan teknisi terbaik untuk kunjungan Anda.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Opsi default: Pilihan Otomatis */}
                    <div 
                      onClick={() => setTechnicianId("")}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex items-center justify-between bg-white/40 ${
                        !technicianId || technicianId === ""
                          ? 'border-[#0d6e6a] bg-[#ebf5f3]/45 shadow-md shadow-[#0d6e6a]/4 scale-[1.01]'
                          : 'border-[#e0edea] hover:border-[#0d6e6a]/50 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-[#0d6e6a]/10 flex items-center justify-center text-[#0d6e6a] flex-shrink-0">
                          <Sparkles className="h-5.5 w-5.5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-xs text-[#0d2d2a] truncate">Pilihan Otomatis</h5>
                          <p className="text-[10px] text-[#577b78] mt-0.5 font-semibold">Ahli terbaik tim kami</p>
                        </div>
                      </div>
                      {(!technicianId || technicianId === "") && (
                        <Check className="h-4.5 w-4.5 text-[#0d6e6a] stroke-[3.5] shrink-0" />
                      )}
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
                          className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex items-center justify-between bg-white/40 ${
                            isSelected
                              ? 'border-[#0d6e6a] bg-[#ebf5f3]/45 shadow-md shadow-[#0d6e6a]/4 scale-[1.01]'
                              : 'border-[#e0edea] hover:border-[#0d6e6a]/50 hover:bg-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <Avatar className="h-10 w-10 flex-shrink-0 border border-slate-100 shadow-sm relative">
                              <AvatarFallback className={`text-xs font-black ${avatarColor}`}>
                                {(t.fullname || 'TK').substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white"></span>
                            </Avatar>
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-xs text-[#0d2d2a] truncate">{t.fullname}</h5>
                              <p className="text-[10px] text-[#577b78] mt-0.5 truncate font-semibold">Spesialis: {t.specialty || 'General'}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-4.5 w-4.5 text-[#0d6e6a] stroke-[3.5] shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ringkasan Pemesanan */}
                <div className="bg-[#ebf5f3]/25 border border-[#e0edea]/60 rounded-2xl p-5 space-y-3">
                  <h4 className="font-extrabold text-xs text-[#0d2d2a] uppercase tracking-wide">Ringkasan Layanan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-[#577b78]">
                    <div className="space-y-1">
                      <span className="font-bold text-[#417874]">Keluhan / Kebutuhan:</span>
                      <p className="font-semibold text-[#0d2d2a] truncate">{complaint}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#417874]">Waktu Kunjungan:</span>
                      <p className="font-semibold text-[#0d2d2a]">{bookingDate} pukul {bookingTime}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[#417874]">Teknisi Pilihan:</span>
                      <p className="font-semibold text-[#0d2d2a]">
                        {technicianId ? technicians.find(t => t.id === technicianId)?.fullname || "Teknisi Pilihan" : "Pilihan Otomatis"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e0edea]/60 flex justify-between gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-11 px-5 text-xs font-bold bg-white border border-[#e0edea] text-[#0d6e6a] hover:bg-[#ebf5f3]/30 rounded-xl gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Kembali
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 text-xs font-extrabold bg-gradient-to-r from-[#0d6e6a] to-[#128a85] text-white shadow-lg shadow-[#0d6e6a]/15 hover:opacity-95 hover:scale-[1.005] transition-all rounded-xl gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" /> Memproses Pemesanan...</>
                    ) : (
                      "Kirim Permintaan Servis"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Catatan garansi */}
            <div className="bg-[#ebf5f3]/25 rounded-2xl p-4 flex items-start gap-3 border border-[#e0edea]/55">
              <AlertCircle className="h-5 w-5 text-[#128a85] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#577b78] leading-relaxed">
                <span className="font-bold text-[#0d2d2a]">Catatan Layanan:</span> Semua pengerjaan servis didukung oleh garansi kualitas kerja selama 30 hari. Jadwal kunjungan teknisi akan disesuaikan dan dikonfirmasi kembali oleh admin.
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
