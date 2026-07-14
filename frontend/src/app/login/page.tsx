"use client";
import { API_BASE_URL } from "@/config";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wrench, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get("redirect") : null;
  
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

      if (!res.ok) throw new Error(data.error || "Gagal login");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (data.user.role === "ADMIN") {
        router.push("/dashboard");
      } else if (data.user.role === "TECHNICIAN") {
        router.push("/mitra/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden select-none animate-in fade-in duration-500"
      style={{ background: 'linear-gradient(145deg, #e8e8e8 0%, #f5f5f5 50%, #ebebeb 100%)' }}>
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-gray-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-gray-300/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Center Card */}
      <div className="w-full max-w-md bg-white/75 backdrop-blur-xl border border-white/70 shadow-[0_24px_85px_rgba(0,0,0,0.07)] rounded-[2.5rem] p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="h-11 w-11 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-md">
            <Wrench className="h-5.5 w-5.5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">SERVIS KITA</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Management System</p>
          <h2 className="text-lg font-bold text-gray-900 mt-6 tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-gray-400 mt-1 text-sm">Masuk untuk mengelola operasional Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200/60 text-red-600 text-xs rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-gray-600 font-semibold text-xs">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm px-4"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-600 font-semibold text-xs">Password</Label>
              <Link href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Lupa password?</Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-gray-50/80 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-gray-900 text-sm pl-4 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="pt-3">
            <Button 
              type="submit" 
              className="w-full h-11 bg-gray-900 text-white font-bold rounded-xl shadow-sm hover:bg-gray-800 transition-all text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memeriksa...</>
              ) : "Masuk ke Akun Anda"}
            </Button>
          </div>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Belum punya akun?{" "}
          <Link href="/register" className="text-gray-900 hover:underline font-bold ml-1">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 select-none" style={{ background: 'linear-gradient(145deg, #e8e8e8 0%, #f5f5f5 50%, #ebebeb 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
          <p className="text-xs font-semibold text-gray-400 tracking-wide">Memuat Halaman Login...</p>
        </div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
