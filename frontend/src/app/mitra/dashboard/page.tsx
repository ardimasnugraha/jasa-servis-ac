"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  MessageSquare, 
  User, 
  UserCheck 
} from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: 'Selesai',   color: '#16a34a', bg: 'rgba(22,163,74,0.08)'   },
  SELESAI:   { label: 'Selesai',   color: '#16a34a', bg: 'rgba(22,163,74,0.08)'   },
  PENDING:   { label: 'Menunggu',  color: '#d97706', bg: 'rgba(217,119,6,0.08)'   },
  MENUNGGU:  { label: 'Menunggu',  color: '#d97706', bg: 'rgba(217,119,6,0.08)'   },
  SCHEDULED: { label: 'Terjadwal', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
  TERJADWAL: { label: 'Terjadwal', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
  CANCELLED: { label: 'Batal',     color: '#dc2626', bg: 'rgba(220,38,38,0.08)'   },
  DIBATALKAN:{ label: 'Batal',     color: '#dc2626', bg: 'rgba(220,38,38,0.08)'   },
  DIBATAL:   { label: 'Batal',     color: '#dc2626', bg: 'rgba(220,38,38,0.08)'   },
};

export default function MitraDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [technicianDetail, setTechnicianDetail] = useState<any>(null);
  const [assignedBookings, setAssignedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboardData = (parsedUser: any) => {
    setLoading(true);
    // Fetch all bookings and filter for this technician
    fetch(`${API_BASE_URL}/api/bookings`)
      .then(res => res.json())
      .then(bookingsData => {
        const filtered = bookingsData.filter((b: any) => 
          b.technician && b.technician.id === parsedUser.technicianId
        );
        setAssignedBookings(filtered);
        
        // Also fetch technician profile to see status & specialty
        return fetch(`${API_BASE_URL}/api/technicians`);
      })
      .then(res => res?.json())
      .then(techData => {
        if (techData && Array.isArray(techData)) {
          const matched = techData.find(t => t.id === parsedUser.technicianId);
          if (matched) {
            setTechnicianDetail(matched);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading technician dashboard:", err);
        setLoading(false);
      });
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    if (status === "SELESAI" && !confirm("Apakah Anda yakin telah menyelesaikan pengerjaan ini?")) return;
    
    setUpdatingId(bookingId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error();
      
      // Update local state by reloading data
      fetchDashboardData(user);
    } catch (e) {
      alert("Gagal memperbarui status pengerjaan.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    let userData = null;
    try {
      userData = localStorage.getItem("user");
    } catch (e) {
      console.error(e);
    }
    
    if (!userData) {
      router.push("/login?redirect=/mitra/dashboard");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "TECHNICIAN") {
        router.push("/");
        return;
      }
      setUser(parsedUser);
      fetchDashboardData(parsedUser);
    } catch (e) {
      console.error(e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 select-none">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-foreground animate-spin"
          style={{ borderTopColor: '#111111', borderRightColor: '#374151' }} />
        <p className="text-xs font-semibold text-gray-400 tracking-wide">Memuat Dashboard Teknisi...</p>
      </div>
    );
  }

  // Stats calculation
  const totalJobs = assignedBookings.length;
  const activeJobs = assignedBookings.filter(b => 
    b.status !== 'SELESAI' && 
    b.status !== 'COMPLETED' && 
    b.status !== 'CANCELLED' && 
    b.status !== 'DIBATALKAN' && 
    b.status !== 'DIBATAL'
  ).length;
  const completedJobs = assignedBookings.filter(b => 
    b.status === 'SELESAI' || 
    b.status === 'COMPLETED'
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      
      {/* 1. WELCOME HEADER */}
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-slate-950 text-white rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/15">
            <Wrench className="h-7 w-7 text-blue-300 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block">Dashboard Mitra Teknisi</span>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">{user?.fullname || "Mitra Teknisi"}</h1>
            <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-2">
              <span>Spesialisasi: <strong className="text-white">{technicianDetail?.specialty || "Umum"}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${technicianDetail?.status === "sedang dalam pekerjaan" ? "bg-amber-400" : "bg-emerald-400"}`} />
                Status: <strong className="text-white capitalize">{technicianDetail?.status || "Aktif"}</strong>
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <Link href="/client/chat" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full md:w-auto h-10 rounded-xl text-xs font-semibold text-white border-white/20 hover:bg-white/10 bg-transparent flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" /> Chat Admin
            </Button>
          </Link>
          <Link href="/mitra" className="flex-1 md:flex-none">
            <Button className="w-full md:w-auto h-10 rounded-xl text-xs font-semibold bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" /> Profil Kemitraan
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-gray-100 bg-white/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Pekerjaan</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{totalJobs}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Sedang Berjalan</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{activeJobs}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-100 bg-white/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Pekerjaan Selesai</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{completedJobs}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. ASSIGNED JOBS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span>Daftar Tugas Pekerjaan Anda</span>
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">{assignedBookings.length}</span>
        </h2>

        {assignedBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
            <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Belum Ada Tugas Ditugaskan</h4>
            <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
              Saat ini admin belum menugaskan pekerjaan untuk spesialisasi Anda. Pastikan status Anda aktif untuk menerima pekerjaan baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedBookings.map((booking) => {
              const config = statusConfig[booking.status || 'PENDING'] || statusConfig.PENDING;
              const isOngoing = booking.status !== 'SELESAI' && booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && booking.status !== 'DIBATALKAN' && booking.status !== 'DIBATAL';

              return (
                <div 
                  key={booking.id} 
                  className="bg-white border border-gray-200/80 rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kode Booking</span>
                      <h4 className="font-extrabold text-sm text-gray-900 mt-0.5">{booking.bookingCode || "NP-XXXX"}</h4>
                    </div>
                    <span 
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider" 
                      style={{ color: config.color, backgroundColor: config.bg }}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-grow">
                    {/* Customer */}
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Pelanggan</span>
                        <span className="text-xs font-bold text-gray-800">{booking.customer}</span>
                      </div>
                    </div>

                    {/* Alamat */}
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Alamat Pengerjaan</span>
                        <span className="text-xs text-gray-600 leading-relaxed block">{booking.customerAddress}</span>
                      </div>
                    </div>

                    {/* Complaint */}
                    <div className="flex gap-3 bg-gray-50 p-3.5 rounded-2xl">
                      <div className="h-6 w-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Wrench className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Keluhan / Deskripsi</span>
                        <span className="text-xs text-gray-700 font-medium leading-relaxed block mt-0.5">{booking.complaint}</span>
                      </div>
                    </div>

                    {/* Tanggal & Waktu */}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> 
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {booking.bookingTime || "09:00"} WIB
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  {isOngoing && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                      {booking.customerPhone && (
                        <Link 
                          href={`https://wa.me/62${booking.customerPhone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-gray-200 hover:bg-white text-gray-700 flex items-center justify-center gap-1.5 bg-transparent">
                            <Phone className="h-3.5 w-3.5 text-green-500" /> WhatsApp
                          </Button>
                        </Link>
                      )}
                      
                      {booking.status === "PENDING" || booking.status === "MENUNGGU" ? (
                        <Button 
                          onClick={() => handleUpdateStatus(booking.id, "TERJADWAL")}
                          disabled={updatingId === booking.id}
                          className="flex-grow h-10 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                        >
                          {updatingId === booking.id ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Terima Tugas"}
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleUpdateStatus(booking.id, "SELESAI")}
                          disabled={updatingId === booking.id}
                          className="flex-grow h-10 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
                        >
                          {updatingId === booking.id ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Selesaikan Tugas"}
                        </Button>
                      )}
                    </div>
                  )}

                  {!isOngoing && (
                    <div className="px-5 py-3.5 bg-emerald-50/50 border-t border-gray-100 flex items-center justify-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Tugas Selesai Dikerjakan
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
