"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Wind, 
  Zap, 
  Flame, 
  Grid, 
  MapPin, 
  Search, 
  HelpCircle, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  User, 
  LogOut, 
  Sparkles, 
  Check, 
  Navigation,
  ShieldCheck,
  RefreshCw,
  Star,
  BookOpen,
  Smartphone,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { getAutoPrice } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: string[];
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("AC");
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("");
  const [scrolled, setScrolled] = useState(false);
  
  const locations = ["Jakarta", "Tangerang", "Bekasi", "Depok", "Bogor", "Bandung", "Surabaya"];

  // Handle sticky header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
  };

  // 10+ Categories matching website structure
  const categories: Category[] = [
    {
      id: "Bangunan",
      name: "Bangunan",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M8 11h8" />
          <path d="M12 7v8" />
        </svg>
      ),
      subcategories: [
        "Tukang Sipil",
        "Kernet Bangunan",
        "Tukang Baja Ringan",
        "Tukang Cat",
        "Arsitek",
        "Tukang Keramik",
        "Tukang Plafon",
        "Konsultan Bangunan",
        "Tukang Cor Beton",
        "Tukang Galian",
        "Tukang Taman",
        "Instalasi Pipa",
        "Renovasi & Perbaikan"
      ]
    },
    {
      id: "AC",
      name: "AC",
      icon: <Wind className="h-6 w-6" />,
      subcategories: [
        "Cuci AC (Cleaning)",
        "Pasang AC Baru",
        "Bongkar AC Lama",
        "Bongkar Pasang AC",
        "Perbaikan AC Rusak",
        "Isi Freon (R32/R410)",
        "Servis AC Berkala"
      ]
    },
    {
      id: "Listrik",
      name: "Listrik",
      icon: <Zap className="h-6 w-6" />,
      subcategories: [
        "Instalasi Kabel Baru",
        "Perbaikan Korsleting",
        "Pasang Lampu / MCB",
        "Servis Panel Listrik",
        "Instalasi Grounding"
      ]
    },
    {
      id: "Montir",
      name: "Montir",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
      subcategories: [
        "Tune Up Mesin Mobil",
        "Ganti Aki Kendaraan",
        "Perbaikan Rem",
        "Servis Motor Ringan",
        "Montir Panggilan 24j"
      ]
    },
    {
      id: "Las",
      name: "Las",
      icon: <Flame className="h-6 w-6" />,
      subcategories: [
        "Pembuatan Kanopi",
        "Pembuatan Pagar Besi",
        "Las Teralis Jendela",
        "Reparasi Pintu Besi",
        "Konstruksi Rangka Baja"
      ]
    },
    {
      id: "SumurBor",
      name: "Sumur Bor",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H7M19 12H5M17 19H7" />
        </svg>
      ),
      subcategories: [
        "Pengeboran Baru 20m",
        "Pengeboran Dalam 40m+",
        "Servis Pompa Submersible",
        "Kuras Sumur Bor",
        "Instalasi Filter Air"
      ]
    },
    {
      id: "Lainnya",
      name: "Lainnya",
      icon: <Grid className="h-6 w-6" />,
      subcategories: [
        "Sedot WC",
        "Pest Control",
        "Fogging Disinfektan",
        "Bantu Pindahan Rumah"
      ]
    }
  ];

  const currentCategoryObj = categories.find(c => c.id === selectedCategory) || categories[1];

  const handleBooking = (serviceName: string) => {
    if (!user) {
      router.push(`/login?redirect=/client/booking?service=${encodeURIComponent(serviceName)}`);
    } else {
      router.push(`/client/booking?service=${encodeURIComponent(serviceName)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceName = expertise || (selectedCategory === "AC" ? "Cuci AC (Cleaning)" : `${selectedCategory} Service`);
    handleBooking(serviceName);
  };

  const handleGPSDetect = () => {
    setGpsLoading(true);
    setGpsStatus("Mencari lokasi terdekat...");
    setTimeout(() => {
      setLocation("Jakarta");
      setGpsLoading(false);
      setGpsStatus("Lokasi Terdeteksi: Jakarta (GPS)");
      setTimeout(() => setGpsStatus(""), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden w-full text-slate-800">
      
      {/* 1. STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white text-slate-800 shadow-md py-4" 
          : "bg-slate-900/30 text-white backdrop-blur-sm py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 bg-white rounded-lg flex items-center justify-center text-gray-900 shadow-sm">
              <Wrench className="h-5 w-5 font-bold" />
            </div>
            <div>
              <span className={`text-lg font-black tracking-tight block leading-none ${scrolled ? "text-[#111111]" : "text-white"}`}>SERVIS KITA</span>
              <span className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest">Ahli & Profesional</span>
            </div>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <Link href="#" className="hover:text-gray-300 transition-colors">Bantuan</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Jadi Mitra</Link>
            <Link href={user ? (user.role === "ADMIN" ? "/dashboard/chat" : "/client/chat") : "/login"} className="hover:text-gray-300 transition-colors">Chat</Link>
            <Link href={user ? (user.role === "ADMIN" ? "/dashboard" : "/client/dashboard") : "/login"} className="hover:text-gray-300 transition-colors">Pesanan</Link>
          </nav>

          {/* Profile / Auth / Cart */}
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer p-1.5 hover:bg-white/10 rounded-full transition-all">
              <ShoppingBag className={`h-5 w-5 ${scrolled ? "text-slate-800" : "text-white"}`} />
              <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center text-white">
                0
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href={user.role === "ADMIN" ? "/dashboard" : "/client/dashboard"}>
                  <Button variant="ghost" className={`h-9 px-3.5 rounded-xl border text-xs font-bold gap-1.5 ${
                    scrolled 
                      ? "border-slate-200 text-slate-800 hover:bg-slate-50" 
                      : "border-white/20 text-white hover:bg-white/10 hover:text-white"
                  }`}>
                    <User className="h-3.5 w-3.5" />
                    {user.fullname ? user.fullname.split(" ")[0] : "Akun"}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" className={`h-9 w-9 p-0 rounded-xl ${scrolled ? "hover:bg-red-50 text-red-500" : "hover:bg-red-500/20 text-red-300 hover:text-red-100"}`} title="Keluar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className={`h-9 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                    scrolled 
                      ? "border-slate-200 text-slate-800 hover:bg-slate-50" 
                      : "border-white/20 text-white hover:bg-white/10 hover:text-white"
                  }`}>
                    <User className="h-3.5 w-3.5" /> Login
                  </Button>
                </Link>
                <span className="text-white/20 text-xs">|</span>
                <Link href="/register" className={`text-xs font-semibold hover:text-gray-300 transition-colors ${scrolled ? "text-slate-800" : "text-white"}`}>
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION & GRID CATEGORY */}
      <div className="bg-[#111111] text-white relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#193363] via-[#111111] to-[#254d91]" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#111111]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight max-w-3xl mx-auto">
            Kami Hadir untuk Memudahkan Kebutuhan Anda
          </h1>
          {/* Sub-headline */}
          <p className="text-gray-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-10 max-w-2xl mx-auto">
            Tukang Profesional + 10 Kategori + Jaminan Refund + Pencarian Terdekat + Live Chat + Transaksi Aman
          </p>

          {/* Grid Kategori Utama */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4 my-8 max-w-5xl mx-auto">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? "bg-gray-300 text-[#111111] shadow-lg scale-105"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <div className="mb-2 shrink-0">{c.icon}</div>
                  <span className="text-xs font-bold tracking-tight truncate w-full">{c.name}</span>
                </div>
              );
            })}
          </div>

          {/* Tag Sub-Kategori Cepat */}
          <div className="flex flex-wrap gap-2 max-w-4xl mx-auto justify-center mb-10 min-h-[5.5rem] p-4 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
            {currentCategoryObj.subcategories.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => handleBooking(sub)}
                className="text-[11px] font-bold px-4 py-2 bg-white/10 hover:bg-gray-300 hover:text-[#111111] text-white border border-white/10 hover:border-gray-300 transition-all rounded-full flex items-center gap-1.5"
              >
                {sub} • Rp {getAutoPrice(sub).toLocaleString('id-ID')}
                <Sparkles className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>

          {/* Search Card (Floating) */}
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSearch} className="bg-white rounded-full p-3 shadow-2xl flex flex-col md:flex-row gap-2 items-center text-slate-800">
              {/* Location Selector */}
              <div className="w-full md:w-5/12 flex items-center px-6 py-2 border-b md:border-b-0 md:border-r border-slate-200">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <div className="w-full text-left">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</label>
                  <select 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none py-0.5 cursor-pointer"
                  >
                    <option value="">Pilih Lokasi</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                {/* Tukang Terdekat Button */}
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  className="ml-2 h-9 px-4 bg-blue-50 hover:bg-blue-100 text-[#111111] rounded-full flex items-center gap-1 transition-all text-[10px] font-bold shrink-0"
                  disabled={gpsLoading}
                >
                  <Navigation className={`h-3 w-3 text-blue-600 ${gpsLoading ? "animate-pulse" : ""}`} />
                  {gpsLoading ? "GPS..." : "GPS"}
                </button>
              </div>

              {/* Sub-category Selector */}
              <div className="w-full md:w-5/12 flex items-center px-6 py-2">
                <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <div className="w-full text-left">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Keahlian</label>
                  <select 
                    value={expertise} 
                    onChange={(e) => setExpertise(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none py-0.5 cursor-pointer"
                  >
                    <option value="">Pilih Sub Kategori</option>
                    {currentCategoryObj.subcategories.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cari Tukang Button */}
              <Button 
                type="submit" 
                className="w-full md:w-auto h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all shrink-0 hover:scale-[1.02]"
              >
                <Search className="h-4.5 w-4.5" />
                Cari Tukang
              </Button>
            </form>

            {gpsStatus && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 bg-[#374151] text-white font-bold text-xs py-1.5 px-4 rounded-xl shadow-lg border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300 z-20">
                {gpsStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. VALUE PROPOSITIONS (6 Keunggulan) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs bg-blue-100 text-blue-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Keunggulan Layanan</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Kenapa Memilih Servis Kita?</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Tukang Profesional */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 border border-blue-500/15">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">Tukang Profesional</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pilih tukang terdekat dengan sistem harian, borongan, atau per unit.
              </p>
            </div>
          </div>

          {/* 2. 10 Kategori */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-[#374151]/10 rounded-2xl flex items-center justify-center text-[#374151] shrink-0 border border-[#374151]/15">
              <Grid className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">10 Kategori</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Tersedia tukang di 10 kategori seperti bangunan, listrik, AC, bengkel, dan lainnya.
              </p>
            </div>
          </div>

          {/* 3. Jaminan Refund */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/15">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">Jaminan Refund</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Mudah refund jika order dibatalkan. Uang kembali cepat ke rekening Anda.
              </p>
            </div>
          </div>

          {/* 4. Pencarian Terdekat */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-500/15">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">Pencarian Terdekat</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Temukan tukang profesional terdekat dari lokasi Anda dengan cepat dan akurat, cukup sekali klik.
              </p>
            </div>
          </div>

          {/* 5. Live Chat */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-600 shrink-0 border border-violet-500/15">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">Live Chat</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Komunikasi langsung dengan tukang melalui fitur chat real-time, tanpa perlu tukar nomor pribadi.
              </p>
            </div>
          </div>

          {/* 6. Transaksi Aman */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-all">
            <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700 shrink-0 border border-emerald-500/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">Transaksi Aman</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pembayaran lebih tenang dengan sistem escrow dan jaminan refund jika pekerjaan tidak sesuai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA PEMESANAN (How it Works) */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs bg-[#ebf3f1] text-[#111111] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Langkah Mudah</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Pesan Tukang Profesional dalam Hitungan Menit</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "1",
                title: "Cari Tukang Terdekat",
                desc: "Isi form pencarian seperti lokasi dan keahlian dan klik button cari tukang kemudian profil tukang yang ada di sekitar lokasi anda akan terlihat"
              },
              {
                step: "2",
                title: "Pilih Tukang Terbaik",
                desc: "Pilih tukang terbaik dari hasil pencarian, pastikan membaca deskripsi, peralatan yang di punya, kebijakan dan hari atau waktu yang tersedia kemudian lakukan order."
              },
              {
                step: "3",
                title: "Order Diterima Tukang",
                desc: "Detail pesanan di terima oleh tukang dan feature chat tersedia untuk komunikasi antara customer dan tukang, kemudian tukang mengkonfirmasi pesanan."
              },
              {
                step: "4",
                title: "Pengerjaan Oleh Tukang",
                desc: "Tukang datang ke lokasi sesuai jadwal dan konfirmasi mulai pengerjaan, Jika pengerjaan selesai tukang meminta konfirmasi selesai kepada customer melalui aplikasi atau website."
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm flex flex-col items-center text-center relative z-10">
                <div className="h-10 w-10 bg-gray-300 text-[#111111] font-black text-lg rounded-full flex items-center justify-center mb-4 shadow-md">
                  {step.step}
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 mb-2">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO PEKERJAAN TERBARU */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs bg-yellow-100 text-yellow-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Kualitas Terjamin</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Portfolio Pekerjaan Terbaru</h3>
            <p className="text-slate-500 text-sm mt-1">Lihat hasil pekerjaan terbaru mitra Servis Kita dari berbagai kategori jasa.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Pemasangan baja ringan",
              category: "Tukang Baja Ringan",
              mitra: "Pirman",
              desc: "Siap mengerjakan atap baja ringan Kanopi dan lain lain",
              gradient: "from-blue-600 to-indigo-700"
            },
            {
              title: "Bongkar pasang keramik",
              category: "Tukang Keramik",
              mitra: "Bambang Amiyono Saputro",
              desc: "Bongkar dan pasang keramik, dinding, lantai, carport",
              gradient: "from-amber-500 to-orange-600"
            },
            {
              title: "Renovasi atap",
              category: "Tukang Baja Ringan",
              mitra: "Bambang Amiyono Saputro",
              desc: "Pergantian kuda-kuda dan atap",
              gradient: "from-purple-600 to-violet-700"
            },
            {
              title: "Renovasi atap",
              category: "Renovasi & Perbaikan",
              mitra: "Bambang Amiyono Saputro",
              desc: "Perbaikan dan pergantian atap",
              gradient: "from-teal-600 to-emerald-700"
            }
          ].map((port, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
              <div className={`h-40 bg-gradient-to-tr ${port.gradient} p-5 flex flex-col justify-between text-white relative`}>
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold self-start">{port.category}</span>
                <p className="text-[10px] font-bold text-yellow-300 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" /> Jakarta
                </p>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-snug group-hover:text-[#111111] transition-colors">{port.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-3">{port.desc}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Mitra Tukang</span>
                    <span className="text-xs font-bold text-slate-700">{port.mitra}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="h-3 w-3 fill-gray-300 text-gray-300 shrink-0" />
                    <span className="text-[10px] font-black text-yellow-700">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PROMO BANNER (Countdown) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="rounded-3xl p-6 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Promo Terbatas</span>
            <h3 className="text-xl font-black mt-2 leading-tight">Selalu ada diskon untuk semua keahlian!</h3>
            <p className="text-[11px] opacity-90 mt-1">Berlaku s.d. 15 Agu 2026 (Segera berakhir!)</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shrink-0 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider">Sisa Waktu Promo</span>
            <span className="block text-xl font-black tracking-tight mt-1 text-yellow-300">39 Hari Lagi</span>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Ulasan Pelanggan</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">Kata Customer Kami</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Sarah M",
              location: "Cakung, Jakarta Timur",
              review: "Saya sangat puas dengan layanan ini! Tukang datang tepat waktu dan hasilnya sangat rapi."
            },
            {
              name: "Budi Santoso",
              location: "Jakarta Selatan",
              review: "Pelayanan baik dan harga bersahabat. Tukang sangat profesional dan ramah."
            },
            {
              name: "Rina Ananda",
              location: "Bandung, Jawa Barat",
              review: "Sangat membantu! Saya tidak perlu repot mencari tukang, cukup pesan lewat aplikasi."
            },
            {
              name: "Doni Prasetyo",
              location: "Surabaya, Jawa Timur",
              review: "Cukup puas dengan pelayanannya. Sedikit terlambat datang, tapi hasil kerja bagus."
            }
          ].map((test, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <p className="text-xs text-slate-500 italic leading-relaxed">"{test.review}"</p>
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h5 className="font-extrabold text-xs text-slate-800">{test.name}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">{test.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CERITA & TIPS (Blog) */}
      <section className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Inspirasi & Panduan</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">Cerita & Tips Seputar Layanan Tukang</h3>
            </div>
            <Button variant="outline" className="rounded-xl font-bold h-10 text-xs border-slate-200 bg-white flex gap-2">
              Lihat Semua <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Biaya Pasang Listrik Baru Beserta Instalasi Per Titik (Terbaru & Lengkap)",
                desc: "Rincian biaya pemasangan meteran baru PLN standar beserta ongkos kabel per titik instalasi saklar rumah.",
                tag: "Listrik"
              },
              {
                title: "Harga Cuci AC: Jenis Layanan, Kisaran Biaya, dan Kapan Harus Melakukannya",
                desc: "Perbandingan harga cuci AC, isi freon R32, serta waktu terbaik untuk merawat AC rumah Anda agar hemat listrik.",
                tag: "AC"
              },
              {
                title: "10 Penyebab Mesin Cuci Tidak Berputar Hanya Berdengung & Solusinya",
                desc: "Tips praktis mendeteksi masalah kapasitor dinamo mesin cuci bermasalah sebelum memanggil teknisi.",
                tag: "Service"
              },
              {
                title: "Jasa Tukang Bangunan Harian vs Borongan: Mana yang Lebih Menguntungkan?",
                desc: "Simak kelebihan dan kekurangan sistem upah harian vs borongan untuk proyek pembangunan rumah tinggal.",
                tag: "Bangunan"
              }
            ].map((blog, i) => (
              <article key={i} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-md self-start">{blog.tag}</span>
                  <h4 className="font-extrabold text-sm text-slate-800 mt-3 leading-snug group-hover:text-[#111111] transition-colors">{blog.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-4">{blog.desc}</p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 flex justify-end">
                  <Link href="#" className="text-[11px] font-bold text-[#111111] group-hover:text-blue-500 transition-colors flex items-center gap-1">
                    Baca <ArrowRight className="h-3 w-3 shrink-0" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. JADI MITRA CTA */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center bg-gradient-to-br from-[#f5f5f5] to-slate-50 border border-[#e5e7eb] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
          <span className="bg-[#111111] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Kesempatan Bermitra</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111] mt-3">Mau Jadi Mitra Servis Kita?</h3>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-lg mx-auto">
            Nikmati fitur terbaru untuk terhubung dengan customer dengan 10 Kategori Lebih Pekerjaan! Tersedia di seluruh wilayah Indonesia.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button className="h-11 px-8 rounded-xl font-bold bg-[#111111] hover:bg-[#374151] text-white shadow-md">
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* 10. DOWNLOAD MOBILE APP BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-[#122547] text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="bg-gray-300 text-[#111111] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Aplikasi Seluler</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3 leading-tight tracking-tight">Cari tukang terdekat dengan mudah, aman dan cepat. Servis Kita selalu gercep!</h3>
            <p className="text-sm text-white/80 mt-3">Download Mobile App di:</p>
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <Link href="#" className="h-10 bg-slate-900 border border-white/10 rounded-xl px-4 flex items-center gap-2 hover:bg-slate-800 transition-all">
                <Smartphone className="h-5 w-5 text-white shrink-0" />
                <div className="text-left">
                  <span className="block text-[8px] text-white/60 leading-none">GET IT ON</span>
                  <span className="block text-xs font-bold leading-tight">Google Play</span>
                </div>
              </Link>
              <Link href="#" className="h-10 bg-slate-900 border border-white/10 rounded-xl px-4 flex items-center gap-2 hover:bg-slate-800 transition-all">
                <svg className="h-5 w-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.51-1.45z" />
                </svg>
                <div className="text-left">
                  <span className="block text-[8px] text-white/60 leading-none">Download on the</span>
                  <span className="block text-xs font-bold leading-tight">App Store</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block shrink-0">
            <div className="h-60 w-32 bg-slate-900 border-4 border-slate-800 rounded-3xl shadow-xl flex items-center justify-center p-3 relative">
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-800 rounded-full" />
              <div className="h-full w-full bg-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-2 text-white">
                <Wrench className="h-8 w-8 text-gray-300 mb-2 animate-bounce" />
                <span className="text-[9px] font-black tracking-widest leading-none">SERVIS KITA</span>
                <span className="text-[6px] text-white/50 uppercase tracking-widest mt-1">App</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER COMPREHENSIVE */}
      <footer className="bg-slate-900 text-white/50 text-xs py-12 border-t border-white/5 select-none w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90">
              <div className="h-8 w-8 bg-white/90 rounded-lg flex items-center justify-center text-gray-900">
                <Wrench className="h-4.5 w-4.5 font-bold" />
              </div>
              <span className="text-base font-black text-white tracking-tight">SERVIS KITA</span>
            </Link>
            <Button variant="outline" className="w-full h-9 rounded-lg text-[10px] font-bold text-white border-white/10 hover:bg-white/10 hover:text-white bg-transparent">
              Jadi Mitra Servis Kita
            </Button>
            <div className="pt-2">
              <span className="block text-[10px] uppercase font-bold text-white/40 mb-2">Partner Pembayaran</span>
              <div className="flex gap-2 flex-wrap opacity-60">
                <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] text-white font-bold">QRIS</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] text-white font-bold">BCA</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] text-white font-bold">Mandiri</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] text-white font-bold">Midtrans</span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Kategori</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">Bangunan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Listrik</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">AC & Pendingin</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Montir Mobil/Motor</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tukang Las</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sumur Bor</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Perusahaan</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Jadi Mitra</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Facebook</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Lainnya</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Term and use</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blogs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div className="space-y-4">
            <h5 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Unduh Aplikasi</h5>
            <div className="flex flex-col gap-2">
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] text-white flex items-center gap-1.5 cursor-pointer hover:bg-slate-800">
                <Smartphone className="h-4 w-4 text-white shrink-0" /> Play Store
              </span>
              <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] text-white flex items-center gap-1.5 cursor-pointer hover:bg-slate-800">
                <svg className="h-4 w-4 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.2.12.3.12.87 0 1.95-.57 2.51-1.45z" />
                </svg> App Store
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-white/5 pt-8 text-center text-white/30 text-[10px]">
          Copyright © 2026 Servis Kita. All rights reserved
        </div>
      </footer>

    </div>
  );
}
