"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BellRing, FileText, CheckCircle2, User, Wrench, ShieldAlert } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type ServiceReport = {
  id: string;
  bookingCode: string;
  customerName: string;
  technicianName: string;
  diagnosis: string;
  actionTaken: string;
  totalCost: number;
  createdAt: string;
};

export default function ServicesPage() {
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for Detail Dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null);

  const [bookingId, setBookingId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, bRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/service-reports`),
        fetch(`${API_BASE_URL}/api/bookings`),
      ]);
      setReports(await rRes.json());
      const bData = await bRes.json();
      setBookings(bData.filter((b: any) => b.status !== 'SELESAI'));
    } catch (err) {
      console.error("Error fetching service data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const selectedBooking = bookings.find(b => b.id === bookingId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/service-reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Fix: Use selectedBooking?.technician?.id instead ofselectedBooking?.technicianId
        body: JSON.stringify({ 
          bookingId, 
          technicianId: selectedBooking?.technician?.id || null, 
          diagnosis, 
          actionTaken, 
          totalCost 
        }),
      });
      if (!response.ok) throw new Error();
      setBookingId(""); setDiagnosis(""); setActionTaken(""); setTotalCost("");
      setIsDialogOpen(false);
      fetchData();
    } catch {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = reports.reduce((s, r) => s + Number(r.totalCost), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
            <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))' }}>
              <BellRing className="h-5 w-5" />
            </span>
            Laporan Servis
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Catat dan tinjau hasil pengerjaan servis AC Anda.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-xl font-semibold h-10 px-5 text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))', boxShadow: '0 4px 14px oklch(0.68 0.20 55 / 0.35)' }}>
              <Plus className="h-4 w-4" /> Buat Laporan
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Buat Laporan Servis</DialogTitle>
              <DialogDescription>Isi rincian tindakan yang dilakukan teknisi setelah servis selesai.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Pilih Booking</Label>
                  <div className="col-span-3">
                    <Select value={bookingId} onValueChange={(val) => setBookingId(val || "")} required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih Jadwal Servis" /></SelectTrigger>
                      <SelectContent>
                        {bookings.map(b => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.bookingCode} — {b.customer} ({b.complaint})
                          </SelectItem>
                        ))}
                        {bookings.length === 0 && <SelectItem value="empty" disabled>Tidak ada jadwal tertunda</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diagnosis" className="text-right text-sm">Diagnosis</Label>
                  <Input id="diagnosis" placeholder="Freon kurang, debu menumpuk..." value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)} className="col-span-3 rounded-xl" required />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="actionTaken" className="text-right text-sm mt-2">Tindakan</Label>
                  <Textarea id="actionTaken" placeholder="Pencucian total dan isi ulang freon..." value={actionTaken}
                    onChange={e => setActionTaken(e.target.value)} className="col-span-3 rounded-xl" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalCost" className="text-right text-sm">Total Biaya</Label>
                  <Input id="totalCost" type="number" placeholder="150000" value={totalCost}
                    onChange={e => setTotalCost(e.target.value)} className="col-span-3 rounded-xl" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Laporan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl p-5 text-white relative overflow-hidden shadow-sm"
          style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))' }}>
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <BellRing className="h-5 w-5 text-white/70 mb-2" />
          <div className="text-2xl font-black">{reports.length} Laporan</div>
          <div className="text-xs text-white/70 font-medium">Total servis selesai</div>
        </div>
        <div className="rounded-3xl p-5 text-white relative overflow-hidden shadow-sm"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <CheckCircle2 className="h-5 w-5 text-white/70 mb-2" />
          <div className="text-2xl font-black">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <div className="text-xs text-white/70 font-medium">Total nilai servis</div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="rounded-[2rem] border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] bg-white/75 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-extrabold text-[#0d2d2a]">Riwayat Laporan Servis</CardTitle>
          <CardDescription className="text-xs text-[#577b78]">Daftar detail penanganan pengerjaan servis AC oleh teknisi.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: 'var(--border)' }}>
                {['Kode Booking', 'Pelanggan & Teknisi', 'Tindakan', 'Total Biaya', 'Status', ''].map((h, i) => (
                  <TableHead key={i} className="text-xs font-bold uppercase tracking-wider py-3.5 px-6 text-[#577b78]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-sm text-[#577b78]/70">
                    Belum ada riwayat laporan servis.
                  </TableCell>
                </TableRow>
              )}
              {reports.map(report => (
                <TableRow key={report.id} className="hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <TableCell className="py-4.5 px-6">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg"
                      style={{ background: 'oklch(0.68 0.20 55 / 0.1)', color: 'oklch(0.60 0.18 55)' }}>
                      {report.bookingCode}
                    </span>
                  </TableCell>
                  <TableCell className="py-4.5 px-6">
                    <div className="font-bold text-sm text-[#0d2d2a]">{report.customerName}</div>
                    <div className="text-xs mt-0.5 text-[#577b78] font-medium">Teknisi: {report.technicianName}</div>
                  </TableCell>
                  <TableCell className="py-4.5 px-6 max-w-[200px]">
                    <p className="text-sm truncate text-[#577b78] font-medium" title={report.actionTaken}>{report.actionTaken}</p>
                  </TableCell>
                  <TableCell className="py-4.5 px-6 font-extrabold text-sm text-[#0d2d2a]">
                    Rp {Number(report.totalCost).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="py-4.5 px-6">
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                    </span>
                  </TableCell>
                  <TableCell className="py-4.5 px-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8.5 w-8.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#0d6e6a]/5 hover:border-[#0d6e6a]/15 text-[#577b78] hover:text-[#0d6e6a] cursor-pointer"
                      onClick={() => {
                        setSelectedReport(report);
                        setDetailDialogOpen(true);
                      }}
                      title="Lihat Rincian Laporan"
                    >
                      <FileText className="h-4.5 w-4.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Laporan Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px] select-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#0d2d2a] flex items-center gap-2">
              <FileText className="h-5.5 w-5.5 text-[#0d6e6a]" />
              Detail Laporan Servis
            </DialogTitle>
            <DialogDescription className="text-xs text-[#577b78]">Rincian diagnosis dan tindakan perbaikan AC.</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-5 py-3">
              
              {/* Meta & Status */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-[#e0edea]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#577b78] tracking-wider block mb-1">Kode Booking</span>
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-[#e0edea] text-[#0d6e6a]">
                    {selectedReport.bookingCode}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#577b78] tracking-wider block mb-1">Status Servis</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 uppercase tracking-wider inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                  </span>
                </div>
              </div>

              {/* Pelanggan & Teknisi */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#577b78] border-b border-[#e0edea] pb-1">Otoritas Pihak</h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <div className="h-8.5 w-8.5 rounded-lg bg-[#0d6e6a]/5 flex items-center justify-center text-[#0d6e6a] border border-[#0d6e6a]/10 shrink-0">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pelanggan</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedReport.customerName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-8.5 w-8.5 rounded-lg bg-[#0d6e6a]/5 flex items-center justify-center text-[#0d6e6a] border border-[#0d6e6a]/10 shrink-0">
                      <Wrench className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Teknisi</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedReport.technicianName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#577b78] border-b border-[#e0edea] pb-1">Diagnosis Masalah</h4>
                <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10 text-xs font-semibold text-rose-800 leading-relaxed flex gap-2.5 items-start">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <p>"{selectedReport.diagnosis}"</p>
                </div>
              </div>

              {/* Tindakan */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#577b78] border-b border-[#e0edea] pb-1">Tindakan Perbaikan</h4>
                <div className="p-3.5 bg-[#ebf5f3]/45 rounded-xl border border-[#e0edea]/60 text-xs font-semibold text-slate-700 leading-relaxed italic">
                  "{selectedReport.actionTaken}"
                </div>
              </div>

              {/* Total Cost */}
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-[#e0edea]">
                <span className="text-xs font-bold text-slate-600">Total Nilai Pengerjaan:</span>
                <span className="font-black text-base text-[#0d2d2a]">
                  Rp {selectedReport.totalCost.toLocaleString('id-ID')}
                </span>
              </div>

            </div>
          )}

          <DialogFooter className="pt-2">
            <Button 
              onClick={() => setDetailDialogOpen(false)} 
              className="rounded-xl w-full text-white font-bold h-11 bg-gradient-to-r from-[#0d6e6a] to-[#128a85] cursor-pointer"
            >
              Tutup Rincian
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
