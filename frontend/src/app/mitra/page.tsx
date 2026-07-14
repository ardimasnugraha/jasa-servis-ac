"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  Wrench, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  MapPin, 
  UserCheck, 
  Briefcase 
} from "lucide-react";
import Link from "next/link";

const SPECIALTIES = [
  "Servis AC (Split/Cassette)",
  "Perbaikan Kulkas & Freezer",
  "Reparasi Mesin Cuci",
  "Instalasi Listrik Rumah",
  "Perbaikan Pompa Air",
  "Tukang Ledeng & Pipa",
  "Pengecatan Dinding",
  "Tukang Kayu / Furnitur",
  "Pasang Keramik / Renovasi",
  "Tukang Las & Kanopi",
  "Teknisi Umum / Serabutan"
];

export default function MitraLandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forms
  const [registerForm, setRegisterForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    specialty: SPECIALTIES[0]
  });

  const [upgradeForm, setUpgradeForm] = useState({
    specialty: SPECIALTIES[0]
  });

  useEffect(() => {
    setMounted(true);
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegisterForm({ ...registerForm, [e.target.id]: e.target.value });
  };

  const handleUpgradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpgradeForm({ specialty: e.target.value });
  };

  // Submit new registration as Technician
  const handleRegisterMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register-mitra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error (${res.status})`);
      }

      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");

      setSuccess("Pendaftaran berhasil! Anda otomatis masuk.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setTimeout(() => {
        router.push("/mitra/dashboard");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit upgrade existing USER user to Technician
  const handleBecomeMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/become-mitra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          specialty: upgradeForm.specialty
        }),
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error (${res.status})`);
      }

      if (!res.ok) throw new Error(data.error || "Gagal meningkatkan akun");

      setSuccess("Akun berhasil ditingkatkan menjadi Mitra Teknisi!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        router.push("/mitra/dashboard");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-blue-950 text-white py-20 px-4 md:px-8 select-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Lowongan Kemitraan Teknisi 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Daftar Jadi Mitra <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Servis Kita</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Bergabunglah bersama ribuan teknisi profesional lainnya. Dapatkan pelanggan harian, kelola jadwal Anda sendiri, dan tingkatkan penghasilan hingga 2x lipat dengan sistem bagi hasil yang adil.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold">
                <ShieldCheck className="h-4 w-4 text-blue-400" /> Terpercaya & Aman
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold">
                <DollarSign className="h-4 w-4 text-green-400" /> Komisi Kompetitif
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold">
                <Calendar className="h-4 w-4 text-orange-400" /> Jam Kerja Fleksibel
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            {/* Visual Phone Mockup or graphics */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[340px]">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-blue-300" />
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2.5 py-1 rounded-full">
                    Sistem Otomatis
                  </span>
                </div>
                <h3 className="text-xl font-bold">Lamar Sekarang, Langsung Aktif & Cari Orderan!</h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Cukup isi data diri Anda, pilih spesialisasi keahlian Anda, dan akun Anda akan langsung terdaftar di sistem. Anda bisa langsung masuk ke dashboard mitra untuk mulai mengelola pesanan.
                </p>
              </div>
              
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Pendaftaran Online 100% Gratis</span>
                <span>Proses Cepat &lt; 5 Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Mengapa Memilih Kami?</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Keuntungan Bermitra dengan Servis Kita</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-gray-900">Pendapatan Menjanjikan</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Dapatkan aliran pesanan yang stabil setiap hari dari wilayah sekitar tempat tinggal Anda. Potensi pendapatan bulanan hingga belasan juta rupiah.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-gray-900">Fleksibilitas Kerja</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Anda yang menentukan kapan ingin bekerja dan kapan ingin istirahat. Cukup aktifkan status Anda di aplikasi untuk mulai menerima orderan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-gray-900">Sistem yang Transparan</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Semua detail pesanan, alamat pelanggan, estimasi biaya, dan pembayaran dicatat transparan di aplikasi. Tidak ada biaya tersembunyi.
            </p>
          </div>
        </div>
      </section>

      {/* 3. REGISTRATION / UPGRADE FORM SECTION */}
      <section className="max-w-3xl mx-auto px-4 md:px-8" id="daftar-form">
        <div className="bg-white border border-gray-200/80 shadow-[0_15px_50px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10">
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-bold rounded-xl text-center">
              {success}
            </div>
          )}

          {/* Form Case 1: Already logged in as TECHNICIAN */}
          {user && user.role === "TECHNICIAN" ? (
            <div className="text-center py-8 space-y-6">
              <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <UserCheck className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Anda Sudah Terdaftar Sebagai Mitra</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Selamat! Akun Anda ({user.fullname}) sudah terdaftar sebagai Mitra Teknisi Servis Kita. Anda bisa langsung mengelola orderan di dashboard.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/mitra/dashboard">
                  <Button className="h-11 px-8 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-md cursor-pointer">
                    Masuk ke Dashboard Mitra
                  </Button>
                </Link>
              </div>
            </div>
          ) : 
          
          /* Form Case 2: Logged in as normal Client USER (Upgrade Form) */
          user && user.role === "USER" ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <div className="h-11 w-11 bg-gray-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Briefcase className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Ajukan Sebagai Mitra Teknisi</h3>
                <p className="text-gray-500 text-xs">
                  Upgrade akun Anda saat ini (<strong>{user.fullname}</strong> - {user.email}) menjadi Mitra Teknisi.
                </p>
              </div>

              <form onSubmit={handleBecomeMitra} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="upgrade-specialty" className="text-gray-600 font-semibold text-xs">Pilih Spesialisasi Keahlian Utama Anda</Label>
                  <select
                    id="upgrade-specialty"
                    value={upgradeForm.specialty}
                    onChange={handleUpgradeChange}
                    className="w-full h-10 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-gray-900 focus:border-gray-900 text-sm px-4 outline-none transition-all"
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">Anda bisa menambahkan keahlian tambahan nanti setelah disetujui admin.</p>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gray-900 text-white font-bold rounded-xl shadow-sm hover:bg-gray-800 transition-all text-sm cursor-pointer" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses Upgrade...</>
                    ) : "Kirim Pengajuan & Jadi Teknisi"}
                  </Button>
                </div>
              </form>
            </div>
          ) : 
          
          /* Form Case 3: Guest / Non-logged in (Full Registration Form) */
          (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <div className="h-11 w-11 bg-gray-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Wrench className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Formulir Pendaftaran Mitra</h3>
                <p className="text-gray-500 text-xs">
                  Lengkapi data di bawah ini untuk melamar dan langsung aktif sebagai teknisi.
                </p>
              </div>

              <form onSubmit={handleRegisterMitra} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullname" className="text-gray-600 font-semibold text-xs">Nama Lengkap</Label>
                    <Input id="fullname" required placeholder="Nama lengkap Anda" value={registerForm.fullname} onChange={handleRegisterChange}
                      className="h-10 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm px-4" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-gray-600 font-semibold text-xs">Email Address</Label>
                    <Input id="email" type="email" placeholder="nama@email.com" required value={registerForm.email} onChange={handleRegisterChange}
                      className="h-10 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm px-4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-gray-600 font-semibold text-xs">No. WhatsApp</Label>
                    <Input id="phone" required placeholder="Contoh: 081234567890" value={registerForm.phone} onChange={handleRegisterChange}
                      className="h-10 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm px-4" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-gray-600 font-semibold text-xs">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" required value={registerForm.password} onChange={handleRegisterChange}
                        className="h-10 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm pl-4 pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="specialty" className="text-gray-600 font-semibold text-xs">Spesialisasi Keahlian Utama</Label>
                  <select
                    id="specialty"
                    value={registerForm.specialty}
                    onChange={handleRegisterChange}
                    className="w-full h-10 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-gray-900 focus:border-gray-900 text-sm px-4 outline-none transition-all"
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-gray-600 font-semibold text-xs">Alamat Domisili Lengkap</Label>
                  <Input id="address" required placeholder="Contoh: Jl. Merdeka No. 12, Kel. Menteng, Kec. Menteng, Jakarta Pusat" value={registerForm.address} onChange={handleRegisterChange}
                    className="h-10 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm px-4" />
                </div>

                <div className="pt-3">
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gray-900 text-white font-bold rounded-xl shadow-sm hover:bg-gray-800 transition-all text-sm cursor-pointer" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses Pendaftaran...</>
                    ) : "Daftar Sekarang & Masuk"}
                  </Button>
                </div>
              </form>
              
              <div className="text-center text-gray-400 text-xs mt-4">
                Sudah punya akun?{" "}
                <Link href="/login?redirect=/mitra" className="text-gray-900 hover:underline font-bold ml-1">Masuk di sini</Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
