"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus, Loader2, Calendar as CalendarIcon, Clock, Search,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Booking = {
  id: string;
  bookingCode: string | null;
  customer: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  complaint: string;
  status: string | null;
  bookingDate: string;
  bookingTime: string;
  createdAt: string;
  technician?: {
    id: string;
    fullname: string;
    phone: string;
    specialty: string;
  } | null;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: 'Selesai',   color: 'oklch(0.50 0.18 160)', bg: 'oklch(0.55 0.18 160 / 0.12)' },
  SELESAI:   { label: 'Selesai',   color: 'oklch(0.50 0.18 160)', bg: 'oklch(0.55 0.18 160 / 0.12)' },
  PENDING:   { label: 'Menunggu',  color: 'oklch(0.60 0.18 75)',  bg: 'oklch(0.70 0.18 75 / 0.12)'  },
  MENUNGGU:  { label: 'Menunggu',  color: 'oklch(0.60 0.18 75)',  bg: 'oklch(0.70 0.18 75 / 0.12)'  },
  SCHEDULED: { label: 'Terjadwal', color: 'oklch(0.58 0.22 264)', bg: 'oklch(0.58 0.22 264 / 0.12)' },
  TERJADWAL: { label: 'Terjadwal', color: 'oklch(0.58 0.22 264)', bg: 'oklch(0.58 0.22 264 / 0.12)' },
  CANCELLED: { label: 'Dibatal',   color: 'oklch(0.60 0.22 25)',  bg: 'oklch(0.60 0.22 25 / 0.12)'  },
  DIBATALKAN:{ label: 'Dibatal',   color: 'oklch(0.60 0.22 25)',  bg: 'oklch(0.60 0.22 25 / 0.12)'  },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [complaint, setComplaint] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes, tRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/bookings`),
        fetch(`${API_BASE_URL}/api/customers`),
        fetch(`${API_BASE_URL}/api/technicians`),
      ]);
      setBookings(await bRes.json());
      setCustomers(await cRes.json());
      setTechnicians(await tRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, technicianId, bookingDate, bookingTime, complaint }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan booking");
      setCustomerId(""); setTechnicianId(""); setBookingDate(""); setBookingTime(""); setComplaint("");
      setIsDialogOpen(false);
      fetchData();
    } catch {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStatusUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${selectedBookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Gagal mengupdate status");
      setStatusDialogOpen(false);
      fetchData();
    } catch {
      alert("Terjadi kesalahan saat mengupdate status.");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const StatusBadge = ({ status }: { status: string | null }) => {
    const cfg = statusConfig[(status || '').toUpperCase()];
    if (!cfg) return <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{status || '—'}</span>;
    return (
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.label}
      </span>
    );
  };

  const filtered = bookings.filter(b =>
    b.customer.toLowerCase().includes(search.toLowerCase()) ||
    (b.bookingCode || '').toLowerCase().includes(search.toLowerCase()) ||
    b.complaint.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.60 0.22 264)', borderRightColor: 'oklch(0.62 0.22 295)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
            <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
              <CalendarIcon className="h-5 w-5" />
            </span>
            Booking Servis
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>Jadwalkan dan kelola pesanan servis AC.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-xl font-semibold h-10 px-5 text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))', boxShadow: '0 4px 14px oklch(0.55 0.18 160 / 0.35)' }}>
              <Plus className="h-4 w-4" /> Buat Booking
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Jadwal Booking</DialogTitle>
              <DialogDescription>Pilih pelanggan, teknisi, dan tentukan jadwal servis.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Customer select */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Pelanggan</Label>
                  <div className="col-span-3">
                    <Select value={customerId} onValueChange={(val) => setCustomerId(val || "")} required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih Pelanggan" /></SelectTrigger>
                      <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.fullname || c.email}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Technician select */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Teknisi</Label>
                  <div className="col-span-3">
                    <Select value={technicianId} onValueChange={(val) => setTechnicianId(val || "")} required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih Teknisi" /></SelectTrigger>
                      <SelectContent>{technicians.map(t => <SelectItem key={t.id} value={t.id}>{t.fullname} ({t.specialty || 'Umum'})</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Tanggal</Label>
                  <Input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="col-span-3 rounded-xl" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Waktu</Label>
                  <Input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="col-span-3 rounded-xl" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Keluhan</Label>
                  <Input placeholder="Contoh: AC Kurang Dingin" value={complaint} onChange={e => setComplaint(e.target.value)} className="col-span-3 rounded-xl" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Booking"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Status Booking</DialogTitle>
            <DialogDescription>Ubah status pengerjaan servis ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStatus}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm">Status</Label>
                <div className="col-span-3">
                  <Select value={newStatus} onValueChange={(val) => setNewStatus(val || "")} required>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                    <SelectContent>
                      {['MENUNGGU', 'TERJADWAL', 'SELESAI', 'DIBATALKAN'].map(s => (
                        <SelectItem key={s} value={s}>{statusConfig[s]?.label || s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isStatusUpdating} className="rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))' }}>
                {isStatusUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Update Status"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Booking Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Detail Booking: <span className="font-mono text-base px-2 py-0.5 rounded bg-[#0d6e6a]/10 text-[#0d6e6a]">{selectedBooking?.bookingCode || "BKG-???"}</span>
            </DialogTitle>
            <DialogDescription>Informasi lengkap pesanan servis AC pelanggan.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 py-4">
              {/* Status & Jadwal */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border border-muted">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Status Pengerjaan</span>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Waktu Booking</span>
                  <div className="text-sm font-semibold flex flex-col">
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3 text-muted-foreground" /> {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "—"}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><Clock className="h-3 w-3" /> {selectedBooking.bookingTime ? new Date(selectedBooking.bookingTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "—"}</span>
                  </div>
                </div>
              </div>

              {/* Pelanggan */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold border-b pb-1">Informasi Pelanggan</h4>
                <div className="grid grid-cols-3 text-sm gap-y-2">
                  <span className="text-muted-foreground">Nama</span>
                  <span className="col-span-2 font-medium">{selectedBooking.customer}</span>
                  
                  <span className="text-muted-foreground">Telepon</span>
                  <span className="col-span-2 font-medium">{selectedBooking.customerPhone || "-"}</span>
                  
                  <span className="text-muted-foreground">Email</span>
                  <span className="col-span-2 font-medium break-all">{selectedBooking.customerEmail || "-"}</span>
                  
                  <span className="text-muted-foreground">Alamat</span>
                  <span className="col-span-2 font-medium">{selectedBooking.customerAddress || "-"}</span>
                </div>
              </div>

              {/* Keluhan */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold border-b pb-1">Detail Masalah / Keluhan</h4>
                <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-muted text-sm italic text-muted-foreground">
                  "{selectedBooking.complaint}"
                </div>
              </div>

              {/* Teknisi */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold border-b pb-1">Teknisi yang Ditugaskan</h4>
                {selectedBooking.technician ? (
                  <div className="p-3 rounded-xl border bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0d6e6a]/10 flex items-center justify-center font-bold text-[#0d6e6a] text-sm">
                        {selectedBooking.technician.fullname.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold">{selectedBooking.technician.fullname}</h5>
                        <p className="text-xs text-muted-foreground">Spesialisasi: {selectedBooking.technician.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted-foreground">No. Telepon</p>
                      <p className="text-xs font-bold text-[#0d6e6a]">{selectedBooking.technician.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-muted">
                    Belum ada teknisi yang ditugaskan untuk booking ini.
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)} className="rounded-xl w-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
        <Input placeholder="Cari booking, pelanggan, keluhan..." value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 rounded-xl h-10" style={{ background: 'var(--muted)', border: 'none' }} />
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-lg overflow-hidden" style={{ background: 'var(--card)' }}>
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Daftar Pesanan Servis</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[650px] md:min-w-full">
              <TableHeader>
                <TableRow style={{ borderColor: 'var(--border)' }}>
                  {['Kode', 'Pelanggan', 'Keluhan', 'Jadwal', 'Status', ''].map((h, i) => (
                    <TableHead key={i} className="text-xs font-semibold uppercase tracking-wide py-3 px-5" style={{ color: 'var(--muted-foreground)' }}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Belum ada riwayat pemesanan servis.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map(booking => (
                  <TableRow key={booking.id} className="hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <TableCell className="py-4 px-5">
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: 'oklch(0.58 0.22 264 / 0.1)', color: 'oklch(0.55 0.22 264)' }}>
                        {booking.bookingCode || "BKG-???"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-5 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{booking.customer}</TableCell>
                    <TableCell className="py-4 px-5 text-sm max-w-[180px] truncate" style={{ color: 'var(--muted-foreground)' }}>{booking.complaint}</TableCell>
                    <TableCell className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center text-xs gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <CalendarIcon className="h-3 w-3" />
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("id-ID") : "—"}
                        </div>
                        <div className="flex items-center text-xs gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <Clock className="h-3 w-3" />
                          {booking.bookingTime ? new Date(booking.bookingTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "—"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-5"><StatusBadge status={booking.status} /></TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="rounded-xl h-8 text-xs font-medium"
                          onClick={() => { setSelectedBooking(booking); setDetailDialogOpen(true); }}>
                          Detail
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs font-medium"
                          onClick={() => { setSelectedBookingId(booking.id); setNewStatus(booking.status || "MENUNGGU"); setStatusDialogOpen(true); }}>
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
