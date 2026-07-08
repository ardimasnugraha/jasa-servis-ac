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
  
  // 1. Locations list matching mockup
  const locations = ["Jakarta", "Tangerang", "Bekasi", "Depok", "Bogor", "Bandung", "Surabaya"];

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
  };

  // 2. 11 Categories list (Expanded to 10+ categories)
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
        "Tukang Galian",
        "Tukang Taman"
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
      id: "Plafon",
      name: "Plafon",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h18v6H3zM3 15h18v6H3z" />
        </svg>
      ),
      subcategories: [
        "Pasang Plafon Gypsum",
        "Pasang Plafon PVC",
        "Partisi Ruangan",
        "Perbaikan Plafon Bocor",
        "Finishing Plafon/List"
      ]
    },
    {
      id: "Cat",
      name: "Cat",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22V13M12 13a5 5 0 005-5V4H7v4a5 5 0 005 5z" />
        </svg>
      ),
      subcategories: [
        "Cat Dinding Interior",
        "Cat Dinding Eksterior",
        "Cat Plafon & Kusen",
        "Waterproofing Dinding",
        "Pengecatan Melamik/Duco"
      ]
    },
    {
      id: "Keramik",
      name: "Keramik",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      ),
      subcategories: [
        "Pasang Keramik Lantai",
        "Pasang Keramik Dinding",
        "Pasang Granit / Marmer",
        "Bongkar Pasang Keramik",
        "Kuras & Pasang Nat Baru"
      ]
    },
    {
      id: "Plumbing",
      name: "Plumbing",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22a7 7 0 007-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 007 7z" />
        </svg>
      ),
      subcategories: [
        "Instalasi Pipa Air Bersih",
        "Perbaikan Pipa Bocor/Pecah",
        "Pasang Wastafel/Kran",
        "Servis Pipa Tersumbat",
        "Pasang Tandon/Toren Air"
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

  // 3. Simulated One-Click GPS detection
  const handleGPSDetect = () => {
    setGpsLoading(true);
    setGpsStatus("Mencari lokasi...");
    setTimeout(() => {
      setLocation("Jakarta");
      setGpsLoading(false);
      setGpsStatus("Lokasi Terdeteksi: Jakarta (GPS)");
      setTimeout(() => setGpsStatus(""), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden w-full">
      
      {/* HEADER & HERO - Royal Blue Gradient */}
      <div className="bg-[#1e3d75] text-white relative overflow-hidden pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#193363] via-[#1e3d75] to-[#254d91]" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#0d6e6a]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          
          {/* NAVBAR */}
          <header className="flex items-center justify-between py-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="h-10 w-10 bg-yellow-400 rounded-xl flex items-center justify-center text-[#1e3d75] shadow-md">
                <Wrench className="h-5.5 w-5.5 font-bold" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight block leading-none">SITUKANG</span>
                <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-widest">Ahli & Profesional</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
              <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4" /> Bantuan
              </Link>
              <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Jadi Mitra
              </Link>
              <Link href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Chat
              </Link>
              <Link href={user ? (user.role === "ADMIN" ? "/dashboard" : "/client/dashboard") : "/login"} className="hover:text-yellow-400 transition-colors">
                Pesanan
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer p-2 hover:bg-white/10 rounded-full transition-all">
                <ShoppingBag className="h-5 w-5 text-white" />
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white border border-[#1e3d75]">
                  0
                </span>
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  <Link href={user.role === "ADMIN" ? "/dashboard" : "/client/dashboard"}>
                    <Button variant="ghost" className="h-9 px-4 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white text-xs font-bold gap-2">
                      <User className="h-3.5 w-3.5" />
                      {user.fullname ? user.fullname.split(" ")[0] : "Akun"}
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100" title="Keluar">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" className="h-9 px-4 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white text-xs font-semibold flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Login
                    </Button>
                  </Link>
                  <span className="text-white/30 text-xs">|</span>
                  <Link href="/register" className="text-xs font-semibold hover:text-yellow-400 transition-colors">
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* CATEGORY BAR */}
          <div className="flex items-center gap-6 overflow-x-auto py-4 text-xs font-semibold border-b border-white/5 scrollbar-none">
            {categories.map((c) => (
              <span
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`cursor-pointer whitespace-nowrap pb-1.5 border-b-2 transition-all ${
                  selectedCategory === c.id 
                    ? "border-yellow-400 text-yellow-400 font-bold" 
                    : "border-transparent text-white/70 hover:text-white"
                }`}
              >
                {c.name}
              </span>
            ))}
          </div>

          {/* HERO TEXT */}
          <div className="text-center mt-12 mb-8 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              Temukan Tukang Profesional Terbaik untuk Rumah Anda
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium">
              Satu platform untuk berbagai macam kebutuhan instalasi, pemeliharaan, dan perbaikan terpercaya.
            </p>
          </div>

          {/* CATEGORY ICONS ROW (11 Categories scrollable/grid) */}
          <div className="flex gap-3 overflow-x-auto py-2 my-6 scrollbar-none justify-start md:justify-center w-full">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all shrink-0 w-24 ${
                    isSelected
                      ? "bg-yellow-400 text-[#1e3d75] shadow-lg scale-105"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <div className="mb-2 shrink-0">{c.icon}</div>
                  <span className="text-[11px] font-bold tracking-tight truncate w-full">{c.name}</span>
                </div>
              );
            })}
          </div>

          {/* SUBCATEGORY CHIPS */}
          <div className="flex flex-wrap gap-2 max-w-4xl mx-auto justify-center mb-8 min-h-[5.5rem] p-4 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
            {currentCategoryObj.subcategories.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => handleBooking(sub)}
                className="text-[11px] font-bold px-4 py-2 bg-white/10 hover:bg-yellow-400 hover:text-[#1e3d75] text-white border border-white/10 hover:border-yellow-400 transition-all rounded-full flex items-center gap-1.5"
              >
                {sub}
                <Sparkles className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>

          {/* SEARCH FORM PANEL WITH GPS BUTTON */}
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSearch} className="bg-white rounded-3xl p-3 shadow-xl flex flex-col md:flex-row gap-2 items-center text-slate-800">
              
              {/* Location Select with GPS Button */}
              <div className="w-full md:w-5/12 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</label>
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
                
                {/* 1. GPS One-Click Search */}
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  className="ml-2 h-9 px-3.5 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-[#1e3d75] rounded-xl flex items-center gap-1.5 transition-all text-[10px] font-extrabold border border-blue-100 shrink-0"
                  disabled={gpsLoading}
                >
                  <Navigation className={`h-3.5 w-3.5 text-blue-600 ${gpsLoading ? "animate-pulse" : ""}`} />
                  {gpsLoading ? "GPS..." : "Tukang Terdekat"}
                </button>
              </div>

              {/* Skill / Service Select */}
              <div className="w-full md:w-5/12 flex items-center px-4 py-2">
                <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keahlian / Layanan</label>
                  <select 
                    value={expertise} 
                    onChange={(e) => setExpertise(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none py-0.5 cursor-pointer"
                  >
                    <option value="">Semua Jasa {selectedCategory}</option>
                    {currentCategoryObj.subcategories.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <Button 
                type="submit" 
                className="w-full md:w-auto h-12 px-8 bg-yellow-400 hover:bg-yellow-500 text-[#1e3d75] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0 hover:scale-[1.02]"
              >
                <Search className="h-4.5 w-4.5" />
                Cari Jasa
              </Button>
            </form>

            {gpsStatus && (
              <div className="absolute left-4 -bottom-8 bg-[#1bb2aa] text-white font-bold text-xs py-1.5 px-4 rounded-xl shadow-lg border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
                {gpsStatus}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. PEMESANAN FLEKSIBEL (Harian, Borongan, Per Unit) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Fleksibilitas Kerja</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">Sistem Pemesanan Fleksibel</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">Kami menyediakan 3 jenis sistem kerja untuk menyesuaikan budget dan skala kebutuhan renovasi Anda.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Sistem Harian",
              desc: "Bayar jasa berdasarkan hari kerja tukang. Cocok untuk perbaikan kecil atau renovasi bertahap di bawah pengawasan Anda langsung.",
              benefits: ["Mulai Rp 150rb / hari", "Kontrol bahan bangunan sendiri", "Sangat fleksibel"],
              badgeBg: "bg-emerald-100 text-emerald-800"
            },
            {
              title: "Sistem Borongan",
              desc: "Harga borong jasa + material (atau jasa saja) untuk keseluruhan proyek. Cocok untuk renovasi besar tanpa repot mengawasi setiap hari.",
              benefits: ["Bebas repot material", "Estimasi biaya selesai di awal", "Ada target tanggal selesai"],
              badgeBg: "bg-indigo-100 text-indigo-800"
            },
            {
              title: "Sistem Per Unit / Titik",
              desc: "Harga tetap berdasarkan volume kerja spesifik (per unit AC, per titik instalasi lampu, per m² pasang keramik). Sangat terukur dan transparan.",
              benefits: ["Harga pasti per unit", "Sesuai rincian kuantitas", "Cocok untuk cuci & servis AC"],
              badgeBg: "bg-amber-100 text-amber-800"
            }
          ].map((mode, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${mode.badgeBg}`}>{mode.title}</span>
                <h4 className="font-extrabold text-lg text-slate-800 mt-3">{mode.title}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{mode.desc}</p>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-6">
                <ul className="space-y-2">
                  {mode.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center text-[11px] text-slate-600 font-semibold gap-2">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SAFETY & TRUST BADGES (Live Chat, Escrow, Refund) */}
      <section className="bg-slate-950 text-white py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Live Chat */}
            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/15">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Live Chat Terintegrasi</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                  Hubungi mitra tukang secara langsung lewat aplikasi secara real-time. Tanyakan progres kerja atau konsultasi teknis aman tanpa bertukar nomor pribadi.
                </p>
              </div>
            </div>

            {/* Escrow */}
            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="h-12 w-12 bg-[#1bb2aa]/10 rounded-2xl flex items-center justify-center text-[#1bb2aa] shrink-0 border border-[#1bb2aa]/15">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Escrow (Rekening Bersama)</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                  Uang Anda dijamin aman. Dana disimpan di rekening penampung kami terlebih dahulu, dan baru dicairkan ke tukang setelah pengerjaan selesai Anda setujui.
                </p>
              </div>
            </div>

            {/* Refund */}
            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/15">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Jaminan Refund 100%</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                  Ketenangan ekstra untuk setiap pesanan. Dapatkan jaminan refund penuh jika terjadi pembatalan sepihak dari tukang, atau bila hasil kerja tidak sesuai dengan kesepakatan.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MITRA PORTFOLIO (Gallery of completed works) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Hasil Kerja Nyata</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">Portofolio Pekerjaan Terbaru</h3>
            <p className="text-slate-500 text-sm mt-1">Daftar dokumentasi hasil pengerjaan servis & renovasi terverifikasi oleh mitra ahli kami.</p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold h-10 text-xs border-slate-200 flex gap-2">
            Lihat Semua Portfolio <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Cuci AC Split Panasonic 1 PK",
              category: "Jasa Servis AC",
              location: "BSD City, Tangerang",
              mitra: "Agus Setiawan",
              desc: "Pembersihan evaporator, filter udara, dan drainase air tersumbat.",
              rating: 5,
              tags: ["Cuci AC", "Perawatan"],
              gradient: "from-blue-600 to-indigo-700"
            },
            {
              title: "Instalasi Kanopi Minimalis Baja Ringan",
              category: "Jasa Las & Besi",
              location: "Grogol, Jakarta Barat",
              mitra: "Farrel Budi",
              desc: "Pembuatan rangka kanopi minimalis carport berukuran 5x6m dengan atap spandek pasir.",
              rating: 5,
              tags: ["Kanopi", "Las"],
              gradient: "from-amber-500 to-orange-600"
            },
            {
              title: "Perbaikan Korsleting Kabel Induk MCB",
              category: "Jasa Listrik",
              location: "Harapan Indah, Bekasi",
              mitra: " mareno",
              desc: "Deteksi titik korsleting dalam plafon akibat gigitan tikus & penggantian kabel tembaga standar SNI.",
              rating: 5,
              tags: ["Listrik", "MCB"],
              gradient: "from-purple-600 to-violet-700"
            },
            {
              title: "Pengeboran Sumur Kedalaman 30 Meter",
              category: "Jasa Sumur Bor",
              location: "Ciputat, Tangerang Selatan",
              mitra: "CV Tirta Abadi",
              desc: "Pengeboran sumur bor air bersih, pemasangan pipa paralon PVC, dan pompa submersible jet pump.",
              rating: 5,
              tags: ["Sumur", "Air Bersih"],
              gradient: "from-teal-600 to-emerald-700"
            }
          ].map((port, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-all duration-300">
              
              {/* Cover placeholder graphic using CSS gradients */}
              <div className={`h-40 bg-gradient-to-tr ${port.gradient} p-5 flex flex-col justify-between text-white relative`}>
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold self-start">{port.category}</span>
                <div>
                  <p className="text-[10px] font-bold text-yellow-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" /> {port.location}
                  </p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 leading-snug group-hover:text-[#1e3d75] transition-colors">{port.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-3">{port.desc}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase">Mitra Tukang</span>
                    <span className="text-xs font-bold text-slate-700">{port.mitra}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                    <span className="text-[10px] font-black text-yellow-700">{port.rating}.0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BLOG & TIPS */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Tips & Artikel</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">Blog & Tips Seputar Rumah</h3>
              <p className="text-slate-500 text-sm mt-1">Panduan praktis, rincian estimasi biaya, dan informasi seputar perawatan bangunan dari para ahli.</p>
            </div>
            <Button variant="outline" className="rounded-xl font-bold h-10 text-xs border-slate-200 bg-white flex gap-2">
              Buka Semua Artikel <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Panduan Lengkap Biaya Pasang Listrik Baru & Tambah Daya SNI",
                desc: "Ketahui berapa tarif resmi dari PLN untuk pemasangan meteran baru maupun kenaikan daya listrik rumah beserta tips kelistrikan aman.",
                author: "Divisi Listrik",
                date: "02 Juli 2026",
                tag: "Kelistrikan"
              },
              {
                title: "Berapa Harga Cuci AC yang Wajar? Simak Rincian Ongkosnya",
                desc: "Jangan sampai tertipu tarif murah tapi banyak biaya tambahan. Berikut rincian resmi harga cuci AC, isi freon, serta servis kompresor mati.",
                author: "Divisi AC & Pendingin",
                date: "28 Juni 2026",
                tag: "Air Conditioner"
              },
              {
                title: "Sistem Bayar Harian vs Borongan: Mana yang Lebih Hemat untuk Anda?",
                desc: "Kelebihan dan kekurangan bayar tukang per hari dibanding borongan borong kerjaan. Panduan bagi Anda yang berencana merenovasi rumah.",
                author: "Konsultan Sipil",
                date: "15 Juni 2026",
                tag: "Renovasi Rumah"
              }
            ].map((article, i) => (
              <article key={i} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-md">{article.tag}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{article.date}</span>
                  </div>
                  <h4 className="font-extrabold text-base text-slate-800 leading-snug group-hover:text-[#1e3d75] transition-colors">{article.title}</h4>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{article.desc}</p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Oleh: {article.author}</span>
                  <Link href="#" className="text-[11px] font-bold text-[#1e3d75] group-hover:text-blue-500 transition-colors flex items-center gap-1">
                    Baca Selengkapnya <ArrowRight className="h-3 w-3 shrink-0" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DOWNLOAD MOBILE APP BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#1e3d75] to-[#122547] text-white p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="z-10 max-w-xl text-center md:text-left">
            <span className="bg-yellow-400 text-[#1e3d75] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Aplikasi Seluler</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3 leading-tight tracking-tight">Lebih Mudah & Praktis Lewat Aplikasi Mobile SiTukang</h3>
            <p className="text-sm text-white/80 mt-3 leading-relaxed">
              Dapatkan pembaruan langsung status booking, lakukan live chat dengan tukang saat bepergian, dan pantau invoice pembayaran langsung dari smartphone Anda.
            </p>
            
            {/* Store Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              {/* Play Store Button */}
              <Link href="#" className="h-10 bg-slate-900 border border-white/10 rounded-xl px-4 flex items-center gap-2 hover:bg-slate-800 transition-all">
                <Smartphone className="h-5 w-5 text-white shrink-0" />
                <div className="text-left">
                  <span className="block text-[8px] text-white/60 leading-none">GET IT ON</span>
                  <span className="block text-xs font-bold leading-tight">Google Play</span>
                </div>
              </Link>
              {/* App Store Button */}
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

          {/* Simple mockup representation */}
          <div className="z-10 hidden lg:block shrink-0 relative">
            <div className="h-64 w-36 bg-slate-900 border-4 border-slate-800 rounded-3xl shadow-xl flex items-center justify-center p-3 relative">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-slate-800 rounded-full" />
              <div className="h-full w-full bg-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-2 text-white">
                <Wrench className="h-10 w-10 text-yellow-400 mb-2 animate-bounce" />
                <span className="text-[10px] font-black tracking-widest">SITUKANG</span>
                <span className="text-[7px] text-white/60 uppercase tracking-widest mt-1">Mobile App</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white/50 text-xs py-8 border-t border-white/5 select-none w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 font-black">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="font-bold text-white tracking-tight">SITUKANG</span>
            <span className="text-[10px] text-white/40">© 2026 SiTukang CRM. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Hubungi Kami</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
