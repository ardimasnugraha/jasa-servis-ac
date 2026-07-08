"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ChevronDown, 
  Sparkles, 
  Hammer, 
  Car,
  Check
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
  
  // Locations list for the dropdown/input
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

  // Define service categories matching mockup
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
        "Bongkar AC lama",
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
      icon: <Car className="h-6 w-6" />,
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
      id: "Service",
      name: "Service",
      icon: <Wrench className="h-6 w-6" />,
      subcategories: [
        "Servis Kulkas / Freezer",
        "Servis Mesin Cuci",
        "Servis Pompa Air",
        "Servis Microwave",
        "Servis Water Heater"
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
    // If not logged in, redirect to login with redirect path
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden w-full">
      
      {/* 1. Header (Navbar) & Hero Section - Royal Blue theme like mockup */}
      <div className="bg-[#1e3d75] text-white relative overflow-hidden pb-12">
        {/* Abstract Background Art */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#193363] via-[#1e3d75] to-[#254d91]" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#0d6e6a]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          
          {/* TOP NAVBAR */}
          <header className="flex items-center justify-between py-5 border-b border-white/10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="h-10 w-10 bg-yellow-400 rounded-xl flex items-center justify-center text-[#1e3d75] shadow-md">
                <Wrench className="h-5.5 w-5.5 font-bold" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight block leading-none">ACKITA</span>
                <span className="text-[10px] font-semibold text-yellow-400 uppercase tracking-widest">Ahli & Profesional</span>
              </div>
            </Link>

            {/* Middle Nav - Links */}
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

            {/* Right Nav - Cart & Profile/Auth */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <div className="relative cursor-pointer p-2 hover:bg-white/10 rounded-full transition-all">
                <ShoppingBag className="h-5 w-5 text-white" />
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white border border-[#1e3d75]">
                  0
                </span>
              </div>

              {/* Login / Register or Profile */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href={user.role === "ADMIN" ? "/dashboard" : "/client/dashboard"}>
                    <Button variant="ghost" className="h-9 px-4 rounded-xl border border-white/20 hover:bg-white/10 hover:text-white text-xs font-bold gap-2">
                      <User className="h-3.5 w-3.5" />
                      {user.fullname ? user.fullname.split(" ")[0] : "Akun"}
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="h-9 w-9 p-0 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-100"
                    title="Keluar"
                  >
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

          {/* Subheader category selector */}
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

          {/* CATEGORY ICON GRID */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4 my-8">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? "bg-yellow-400 text-[#1e3d75] shadow-lg scale-105"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <div className="mb-2">{c.icon}</div>
                  <span className="text-xs font-bold tracking-tight">{c.name}</span>
                </div>
              );
            })}
          </div>

          {/* SUBCATEGORY CHIPS */}
          <div className="flex flex-wrap gap-2.5 max-w-4xl mx-auto justify-center mb-8 min-h-[5.5rem] p-4 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
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

          {/* SEARCH FORM PANEL */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-3xl p-3 shadow-xl flex flex-col md:flex-row gap-2 items-center text-slate-800">
              
              {/* Location Select */}
              <div className="w-full md:w-1/3 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200">
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
              </div>

              {/* Skill / Expertise Select */}
              <div className="w-full md:w-1/2 flex items-center px-4 py-2">
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
          </div>

        </div>
      </div>

      {/* 2. Banner / Promotional section - Mockup style banners */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex-1">
        <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#0d6e6a]" />
          Penawaran & Layanan Unggulan Kami
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Banner 1: Tukang Listrik / AC Profesional */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 p-6 flex justify-between relative shadow-lg group hover:shadow-xl transition-all select-none">
            <div className="z-10 flex flex-col justify-between h-48 max-w-[60%]">
              <div>
                <span className="bg-slate-900/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Jasa Listrik</span>
                <h4 className="text-xl font-black mt-3 leading-tight tracking-tight">Tukang listrik profesional & bersertifikat</h4>
              </div>
              <p className="text-[11px] font-medium opacity-90">Siap dipanggil kapan saja untuk perbaikan korsleting & instalasi baru.</p>
            </div>
            {/* Visual element */}
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Zap className="w-full h-full text-slate-900 stroke-[1.5]" />
            </div>
          </div>

          {/* Banner 2: Perawatan AC KITA */}
          <div 
            onClick={() => handleBooking("Cuci AC (Cleaning)")}
            className="cursor-pointer rounded-3xl overflow-hidden text-white p-6 flex justify-between relative shadow-lg group hover:shadow-xl transition-all select-none"
            style={{ background: "linear-gradient(135deg, #0d6e6a 0%, #128a85 100%)" }}
          >
            <div className="z-10 flex flex-col justify-between h-48 max-w-[65%]">
              <div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-yellow-400">Rekomendasi AC</span>
                <h4 className="text-xl font-black mt-3 leading-tight tracking-tight">Butuh perawatan AC? Panggil kami yuk!</h4>
              </div>
              <div>
                <p className="text-[11px] font-medium opacity-85 mb-3">Layanan cuci & servis AC berkala agar udara tetap bersih dan dingin maksimal.</p>
                <Button className="h-8 rounded-lg bg-yellow-400 text-[#0d6e6a] hover:bg-yellow-500 font-extrabold text-[10px] px-3.5 shadow">
                  Pesan Sekarang
                </Button>
              </div>
            </div>
            {/* Visual element */}
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-25 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Wind className="w-full h-full text-white stroke-[1.5]" />
            </div>
          </div>

          {/* Banner 3: Teknisi Standby / Customer Care */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b3a60] to-[#112543] text-white p-6 flex justify-between relative shadow-lg group hover:shadow-xl transition-all select-none md:col-span-2 lg:col-span-1">
            <div className="z-10 flex flex-col justify-between h-48 max-w-[60%]">
              <div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Jaminan Garansi</span>
                <h4 className="text-xl font-black mt-3 leading-tight tracking-tight">Teknisi ahli standby 24 jam & Bergaransi</h4>
              </div>
              <p className="text-[11px] font-medium opacity-80">Jaminan pekerjaan rapi dan garansi 30 hari untuk setiap servis AC Anda.</p>
            </div>
            {/* Visual element */}
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Wrench className="w-full h-full text-white stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Feature Highlights bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-200 pt-8">
          {[
            {
              title: "Garansi Pekerjaan",
              desc: "Garansi 30 hari untuk perbaikan AC jika terjadi kendala pasca pengerjaan.",
              icon: <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 font-bold shrink-0"><Check className="h-5.5 w-5.5" /></div>
            },
            {
              title: "Teknisi Tersertifikasi",
              desc: "Semua teknisi mitra telah melalui verifikasi keahlian, ramah, dan profesional.",
              icon: <div className="h-10 w-10 bg-[#0d6e6a]/10 rounded-2xl flex items-center justify-center text-[#0d6e6a] font-bold shrink-0"><Wrench className="h-5 w-5" /></div>
            },
            {
              title: "Harga Transparan",
              desc: "Biaya servis terinci jelas di invoice elektronik. Bayar mudah via Cash / Transfer.",
              icon: <div className="h-10 w-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 font-bold shrink-0"><Sparkles className="h-5 w-5" /></div>
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              {item.icon}
              <div>
                <h5 className="font-bold text-sm text-slate-800">{item.title}</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Footer */}
      <footer className="bg-slate-900 text-white/50 text-xs py-8 border-t border-white/5 select-none w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900 font-black">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="font-bold text-white tracking-tight">ACKITA</span>
            <span className="text-[10px] text-white/40">© 2026 AC Kita CRM. All rights reserved.</span>
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
