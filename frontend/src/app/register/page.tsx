"use client";
import { API_BASE_URL } from "@/config";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftar");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/client/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-[#bfe7e2] via-[#edf7f5] to-[#ebdff7] relative overflow-hidden select-none animate-in fade-in duration-500">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-[#0d6e6a]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-[#701531]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Center Card */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_24px_85px_rgba(13,110,106,0.06)] rounded-[2.5rem] p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-md">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0d2d2a] tracking-tight">AC KITA</h1>
          <p className="text-[#577b78] text-xs font-semibold uppercase tracking-wider mt-0.5">Management System</p>
          <h2 className="text-xl font-bold text-[#0d2d2a] mt-5 tracking-tight">Buat Akun Baru</h2>
          <p className="text-[#577b78] mt-1 text-sm">Daftar sebagai pelanggan AC KITA.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="fullname" className="text-[#417874] font-semibold text-sm">Nama Lengkap</Label>
            <Input 
              id="fullname" 
              required 
              placeholder="Budi Setiawan"
              value={formData.fullname}
              onChange={handleChange}
              className="h-10 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#417874] font-semibold text-sm">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nama@email.com"
              required 
              value={formData.email}
              onChange={handleChange}
              className="h-10 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[#417874] font-semibold text-sm">No. WhatsApp</Label>
              <Input 
                id="phone" 
                required 
                placeholder="0812..."
                value={formData.phone}
                onChange={handleChange}
                className="h-10 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#417874] font-semibold text-sm">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm pl-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#417874] hover:text-[#0d2d2a] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[#417874] font-semibold text-sm">Alamat Lengkap</Label>
            <Input 
              id="address" 
              required 
              placeholder="Perumahan Indah Blok A..."
              value={formData.address}
              onChange={handleChange}
              className="h-10 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4"
            />
          </div>
          
          <div className="pt-3">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] text-white font-bold rounded-xl shadow-md shadow-[#0d6e6a]/15 hover:opacity-95 transition-all text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : "Daftar & Mulai"}
            </Button>
          </div>
        </form>

        <p className="text-center text-[#577b78] text-sm mt-6">
          Sudah punya akun? <Link href="/login" className="text-[#0d6e6a] hover:text-[#128a85] font-bold ml-1">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
