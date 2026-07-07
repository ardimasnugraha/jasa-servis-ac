"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Wrench, Star, Phone } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Technician = {
  id: string;
  fullname: string | null;
  phone: string | null;
  specialty: string | null;
  status: string | null;
  createdAt: string;
  bookings?: {
    id: string;
    bookingCode: string | null;
    customerName: string;
    bookingDate: string;
    status: string | null;
  }[];
};

const techGradients = [
  'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))',
  'linear-gradient(135deg, oklch(0.55 0.22 264), oklch(0.50 0.22 278))',
  'linear-gradient(135deg, oklch(0.55 0.18 185), oklch(0.52 0.20 200))',
  'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))',
  'linear-gradient(135deg, oklch(0.60 0.22 15), oklch(0.55 0.20 350))',
];

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const fetchTechnicians = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/technicians`)
      .then(res => res.json())
      .then(data => { setTechnicians(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTechnicians(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/technicians`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, phone, specialty }),
      });
      if (!response.ok) throw new Error();
      setFullname(""); setPhone(""); setSpecialty("");
      setIsDialogOpen(false);
      fetchTechnicians();
    } catch {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && technicians.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.55 0.22 295)', borderRightColor: 'oklch(0.60 0.22 264)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
            <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))' }}>
              <Wrench className="h-5 w-5" />
            </span>
            Teknisi
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Kelola tim teknisi — total{' '}
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{technicians.length}</span> teknisi terdaftar.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-xl font-semibold h-10 px-5 text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))', boxShadow: '0 4px 14px oklch(0.55 0.22 295 / 0.35)' }}>
              <Plus className="h-4 w-4" /> Tambah Teknisi
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Teknisi Baru</DialogTitle>
              <DialogDescription>Masukkan informasi teknisi di sini.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {[
                  { id: 'fullname', label: 'Nama Lengkap', value: fullname, setter: setFullname, required: true },
                  { id: 'phone', label: 'No. Telepon', value: phone, setter: setPhone, required: true },
                  { id: 'specialty', label: 'Keahlian', value: specialty, setter: setSpecialty, placeholder: 'Cuci Rutin, Bongkar Pasang...' },
                ].map(f => (
                  <div key={f.id} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={f.id} className="text-right text-sm">{f.label}</Label>
                    <Input id={f.id} value={f.value} onChange={e => f.setter(e.target.value)}
                      placeholder={(f as any).placeholder} className="col-span-3 rounded-xl" required={f.required} />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan Teknisi"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail Technician Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Detail Teknisi: <span className="font-semibold text-[#0d6e6a]">{selectedTechnician?.fullname || 'Tanpa Nama'}</span>
            </DialogTitle>
            <DialogDescription>Profil dan riwayat penugasan servis AC teknisi.</DialogDescription>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-6 py-4">
              {/* Profil Singkat */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-muted">
                <Avatar className="h-14 w-14 ring-2 ring-[#0d6e6a]/20">
                  <AvatarFallback className="text-lg font-bold text-white bg-[#0d6e6a]">
                    {(selectedTechnician.fullname || 'TK').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-base text-foreground">{selectedTechnician.fullname}</h4>
                  <p className="text-xs text-muted-foreground">Spesialisasi: {selectedTechnician.specialty || 'Umum'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No. Telepon: {selectedTechnician.phone}</p>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg border bg-card text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Status Keaktifan</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0d6e6a]/10 text-[#0d6e6a]">
                    ● {selectedTechnician.status || 'Aktif'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border bg-card text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Total Booking</span>
                  <span className="text-sm font-bold text-foreground">
                    {selectedTechnician.bookings?.length || 0} Pekerjaan
                  </span>
                </div>
              </div>

              {/* Daftar Riwayat Tugas */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold border-b pb-1">Daftar Penugasan Booking</h4>
                {selectedTechnician.bookings && selectedTechnician.bookings.length > 0 ? (
                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                    {selectedTechnician.bookings.map((booking) => (
                      <div key={booking.id} className="p-3 rounded-xl border bg-card text-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-mono font-bold text-[#0d6e6a]">
                              {booking.bookingCode || 'BKG-???'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("id-ID") : '—'})
                            </span>
                          </div>
                          <p className="font-semibold text-foreground">Pelanggan: {booking.customerName}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: booking.status === 'SELESAI' || booking.status === 'COMPLETED' ? 'oklch(0.55 0.18 160 / 0.12)' : 'oklch(0.70 0.18 75 / 0.12)',
                            color: booking.status === 'SELESAI' || booking.status === 'COMPLETED' ? 'oklch(0.50 0.18 160)' : 'oklch(0.60 0.18 75)',
                          }}>
                          {booking.status === 'SELESAI' || booking.status === 'COMPLETED' ? 'Selesai' : 'Pending/Terjadwal'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-muted">
                    Teknisi ini belum pernah ditugaskan untuk booking apa pun.
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)} className="rounded-xl w-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))' }}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cards view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.length === 0 && !loading && (
          <div className="col-span-3 text-center py-16 rounded-2xl border-2 border-dashed"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            <Wrench className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Belum ada data teknisi.</p>
          </div>
        )}
        {technicians.map((tech, idx) => (
          <div key={tech.id}
            className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {/* Header band */}
            <div className="h-20 relative" style={{ background: techGradients[idx % techGradients.length] }}>
              <div className="absolute -bottom-6 left-5">
                <Avatar className="h-12 w-12 ring-4" style={{ '--tw-ring-color': 'var(--card)' } as React.CSSProperties}>
                  <AvatarFallback className="text-base font-bold text-white"
                    style={{ background: techGradients[idx % techGradients.length] }}>
                    {(tech.fullname || 'TK').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
                  {tech.status || 'Aktif'}
                </span>
              </div>
            </div>
            <div className="pt-8 pb-4 px-5">
              <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{tech.fullname || 'Tanpa Nama'}</h3>
              {tech.specialty && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3" style={{ color: 'oklch(0.68 0.20 55)' }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tech.specialty}</span>
                </div>
              )}
              {tech.phone && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Phone className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tech.phone}</span>
                </div>
              )}
              <div className="mt-4 pt-3 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'oklch(0.55 0.18 160 / 0.12)', color: 'oklch(0.50 0.18 160)' }}>
                  ● Aktif
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl text-xs h-7 px-3"
                  onClick={() => { setSelectedTechnician(tech); setDetailDialogOpen(true); }}
                >
                  Detail
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
