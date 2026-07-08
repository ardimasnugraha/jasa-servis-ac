"use client";
import { API_BASE_URL } from "@/config";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server error (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Gagal login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get("redirect");

      if (data.user.role === "ADMIN") {
        router.push("/dashboard");
      } else if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/client/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-[#bfe7e2] via-[#edf7f5] to-[#ebdff7] relative overflow-hidden select-none animate-in fade-in duration-500">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-[#0d6e6a]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-[#701531]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Center Card */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_24px_85px_rgba(13,110,106,0.06)] rounded-[2.5rem] p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-md">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0d2d2a] tracking-tight">AC KITA</h1>
          <p className="text-[#577b78] text-xs font-semibold uppercase tracking-wider mt-0.5">Management System</p>
          <h2 className="text-xl font-bold text-[#0d2d2a] mt-6 tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-[#577b78] mt-1 text-sm">Masuk untuk mengelola operasional Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#417874] font-semibold text-sm">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm px-4"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#417874] font-semibold text-sm">Password</Label>
              <Link href="#" className="text-xs font-semibold text-[#0d6e6a] hover:text-[#128a85]">Lupa password?</Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/60 rounded-xl focus-visible:ring-[#0d6e6a] text-sm pl-4 pr-10"
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
          
          <div className="pt-3">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] text-white font-bold rounded-xl shadow-md shadow-[#0d6e6a]/15 hover:opacity-95 transition-all text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memeriksa...</>
              ) : "Masuk ke Akun Anda"}
            </Button>
          </div>
        </form>

        <p className="text-center text-[#577b78] text-sm mt-8">
          Belum punya akun? <Link href="/register" className="text-[#0d6e6a] hover:text-[#128a85] font-bold ml-1">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
