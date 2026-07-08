"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BellRing, FileText, CheckCircle2, User, Wrench, ShieldAlert, Search, DollarSign, Award, ChevronRight } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

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
  const averageRevenue = reports.length > 0 ? totalRevenue / reports.length : 0;

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      r.bookingCode.toLowerCase().includes(term) ||
      r.customerName.toLowerCase().includes(term) ||
      r.technicianName.toLowerCase().includes(term) ||
      r.diagnosis.toLowerCase().includes(term) ||
      r.actionTaken.toLowerCase().includes(term)
    );
  });

  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-[#0d2d2a]">
            <span className="h-10 w-10 rounded-2xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))' }}>
              <BellRing className="h-5.5 w-5.5" />
            </span>
            Laporan Servis
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#577b78]">Catat hasil diagnosis dan tindakan pengerjaan servis AC teknisi.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2.5 rounded-2xl font-bold h-11 px-6 text-white cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))', boxShadow: '0 6px 20px oklch(0.68 0.20 55 / 0.3)' }}>
              <Plus className="h-4.5 w-4.5" /> Buat Laporan Servis
            </Button>
          } />
          <DialogContent className="sm:max-w-[520px] rounded-3xl border border-[#e0edea]">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-[#0d2d2a]">Buat Laporan Servis Baru</DialogTitle>
              <DialogDescription className="text-xs text-[#577b78]">Catat tindakan servis setelah teknisi selesai melakukan kunjungan.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-bold text-[#0d2d2a]">Pilih Jadwal Booking Servis</Label>
                  <Select value={bookingId} onValueChange={(val) => setBookingId(val || "")} required>
                    <SelectTrigger className="rounded-xl h-11 border-[#e0edea] focus:ring-[#0d6e6a]">
                      <SelectValue placeholder="Pilih nomor booking / pelanggan" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {bookings.map(b => (
                        <SelectItem key={b.id} value={b.id} className="text-xs font-medium text-[#0d2d2a] rounded-lg my-0.5">
                          {b.bookingCode} — {b.customer} ({b.complaint})
                        </SelectItem>
                      ))}
                      {bookings.length === 0 && <SelectItem value="empty" disabled className="text-xs">Tidak ada jadwal tertunda</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="diagnosis" className="text-xs font-bold text-[#0d2d2a]">Diagnosis Kerusakan</Label>
                  <Input id="diagnosis" placeholder="Contoh: Freon bocor, kompresor aus, debu tebal..." value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)} className="rounded-xl h-11 border-[#e0edea] focus-visible:ring-[#0d6e6a]" required />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="actionTaken" className="text-xs font-bold text-[#0d2d2a]">Tindakan Perbaikan</Label>
                  <Textarea id="actionTaken" placeholder="Contoh: Pengelasan pipa, pengisian ulang freon R32, cuci evaporator..." value={actionTaken}
                    onChange={e => setActionTaken(e.target.value)} className="rounded-xl min-h-[90px] border-[#e0edea] focus-visible:ring-[#0d6e6a]" required />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="totalCost" className="text-xs font-bold text-[#0d2d2a]">Total Biaya Jasa & Sparepart (Rp)</Label>
                  <Input id="totalCost" type="number" placeholder="Contoh: 350000" value={totalCost}
                    onChange={e => setTotalCost(e.target.value)} className="rounded-xl h-11 border-[#e0edea] focus-visible:ring-[#0d6e6a]" required />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="rounded-xl h-11 w-full text-white font-bold cursor-pointer transition-all hover:bg-[#0d6e6a]"
                  style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan Laporan...</> : "Simpan & Selesaikan Booking"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Summary - Glassmorphism Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="relative rounded-3xl p-5 bg-white/70 border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] overflow-hidden flex items-center gap-4.5 min-h-[105px]">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-amber-600 bg-amber-500/10 border border-amber-500/15 shrink-0">
            <BellRing className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0d2d2a] tracking-tight">{reports.length} Laporan</div>
            <div className="text-xs font-bold text-[#577b78] mt-0.5 uppercase tracking-wide">Total Servis Selesai</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative rounded-3xl p-5 bg-white/70 border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] overflow-hidden flex items-center gap-4.5 min-h-[105px]">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-500/10 border border-emerald-500/15 shrink-0">
            <DollarSign className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0d2d2a] tracking-tight">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <div className="text-xs font-bold text-[#577b78] mt-0.5 uppercase tracking-wide">Total Nilai Servis</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative rounded-3xl p-5 bg-white/70 border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] overflow-hidden flex items-center gap-4.5 min-h-[105px]">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-500/10 border border-blue-500/15 shrink-0">
            <Award className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0d2d2a] tracking-tight">Rp {Math.round(averageRevenue).toLocaleString('id-ID')}</div>
            <div className="text-xs font-bold text-[#577b78] mt-0.5 uppercase tracking-wide">Rata-rata Per Servis</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="rounded-[2rem] border border-[#e0edea] shadow-[0_12px_45px_rgba(13,110,106,0.03)] bg-white/80 backdrop-blur-lg overflow-hidden">
        
        {/* Table Filter Header */}
        <div className="p-6 pb-4 border-b border-[#e0edea]/55 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-extrabold text-[#0d2d2a]">Riwayat Pengerjaan Servis</CardTitle>
            <CardDescription className="text-xs text-[#577b78] mt-0.5">Semua data rekaman diagnosis dan penanganan AC oleh tim teknisi.</CardDescription>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#577b78]" />
            <Input
              type="text"
              placeholder="Cari kode booking, pelanggan, teknisi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 h-10 text-xs font-medium rounded-xl border border-[#e0edea] focus-visible:ring-[#0d6e6a] bg-white/50"
            />
          </div>
        </div>

        {/* Table Area */}
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent" style={{ borderColor: 'var(--border)' }}>
                <TableHead className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78]">Kode Booking</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78]">Pelanggan</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78]">Teknisi Penanggung Jawab</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78]">Tindakan Perbaikan</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78]">Total Biaya</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78]">Status</TableHead>
                <TableHead className="py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-36 text-sm text-[#577b78] font-medium">
                    {searchTerm ? "Tidak ditemukan laporan servis yang cocok dengan pencarian Anda." : "Belum ada riwayat laporan servis."}
                  </TableCell>
                </TableRow>
              )}
              {filteredReports.map(report => (
                <TableRow key={report.id} className="hover:bg-[#0d6e6a]/[0.01] transition-colors" style={{ borderColor: 'var(--border)' }}>
                  {/* Booking Code */}
                  <TableCell className="py-4.5 px-6">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#0d6e6a]/5 text-[#0d6e6a] border border-[#0d6e6a]/10">
                      {report.bookingCode}
                    </span>
                  </TableCell>

                  {/* Customer Info */}
                  <TableCell className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8.5 w-8.5 ring-2 ring-[#0d6e6a]/5">
                        <AvatarFallback className="text-[11px] font-black text-white" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.14 185), oklch(0.50 0.14 195))' }}>
                          {getCustomerInitials(report.customerName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-sm text-[#0d2d2a]">{report.customerName}</span>
                    </div>
                  </TableCell>

                  {/* Technician Info */}
                  <TableCell className="py-4.5 px-6">
                    {report.technicianName && report.technicianName !== "-" ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100/60 border border-slate-200/50 py-1.5 px-3 rounded-xl w-fit">
                        <Wrench className="h-3.5 w-3.5 text-[#0d6e6a]" />
                        <span>{report.technicianName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 italic">
                        <span>Belum Ditugaskan</span>
                      </div>
                    )}
                  </TableCell>

                  {/* Actions Taken */}
                  <TableCell className="py-4.5 px-6 max-w-[220px]">
                    <p className="text-xs text-[#577b78] font-bold truncate leading-relaxed" title={report.actionTaken}>{report.actionTaken}</p>
                  </TableCell>

                  {/* Total Cost */}
                  <TableCell className="py-4.5 px-6 font-extrabold text-sm text-[#0d2d2a] tabular-nums">
                    Rp {Number(report.totalCost).toLocaleString('id-ID')}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-4.5 px-6">
                    <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full w-fit bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                    </span>
                  </TableCell>

                  {/* View Details Action */}
                  <TableCell className="py-4.5 px-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 hover:bg-[#0d6e6a]/5 hover:border-[#0d6e6a]/15 text-[#577b78] hover:text-[#0d6e6a] transition-all cursor-pointer shadow-sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setDetailDialogOpen(true);
                      }}
                      title="Lihat Detail Pengerjaan"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Laporan Dialog (Work Order Style Receipt) */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px] select-none rounded-[2rem] border border-[#e0edea]">
          <DialogHeader className="border-b border-[#e0edea] pb-4">
            <DialogTitle className="text-lg font-black text-[#0d2d2a] flex items-center gap-2.5">
              <FileText className="h-5.5 w-5.5 text-[#0d6e6a]" />
              Detail Laporan Servis AC
            </DialogTitle>
            <DialogDescription className="text-xs text-[#577b78]">Rincian hasil penanganan masalah teknis unit AC.</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-5 py-4 text-xs font-semibold">
              
              {/* Order Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4.5 rounded-2xl bg-slate-50 border border-[#e0edea] relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-[#0d6e6a]/5 rounded-full -mr-3 -mt-3" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Kode Booking</span>
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-[#e0edea] text-[#0d6e6a] shadow-sm">
                    {selectedReport.bookingCode}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Status Laporan</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                  </span>
                </div>
              </div>

              {/* Parties involved */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#577b78] border-b border-[#e0edea] pb-1">Detail Pihak Terlibat</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2.5 items-start">
                    <div className="h-8.5 w-8.5 rounded-lg bg-[#0d6e6a]/5 flex items-center justify-center text-[#0d6e6a] border border-[#0d6e6a]/10 shrink-0">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nama Pelanggan</p>
                      <p className="font-black text-slate-800 text-sm mt-0.5">{selectedReport.customerName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-8.5 w-8.5 rounded-lg bg-[#0d6e6a]/5 flex items-center justify-center text-[#0d6e6a] border border-[#0d6e6a]/10 shrink-0">
                      <Wrench className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Teknisi Penanggung Jawab</p>
                      <p className="font-black text-slate-800 text-sm mt-0.5">{selectedReport.technicianName && selectedReport.technicianName !== "-" ? selectedReport.technicianName : "Belum Ditugaskan"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis box */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#577b78] border-b border-[#e0edea] pb-1">Diagnosis Masalah AC</h4>
                <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10 text-rose-800 leading-relaxed flex gap-2.5 items-start">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="font-bold">"{selectedReport.diagnosis}"</p>
                </div>
              </div>

              {/* Action Taken box */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#577b78] border-b border-[#e0edea] pb-1">Tindakan Perbaikan</h4>
                <div className="p-3.5 bg-[#ebf5f3]/45 rounded-xl border border-[#e0edea]/60 text-slate-700 leading-relaxed italic">
                  "{selectedReport.actionTaken}"
                </div>
              </div>

              {/* Cost summary */}
              <div className="flex justify-between items-center p-4.5 rounded-xl bg-slate-50 border border-[#e0edea]">
                <span className="text-xs font-bold text-slate-600">Total Nilai Pengerjaan:</span>
                <span className="font-black text-base text-[#0d2d2a] tabular-nums">
                  Rp {selectedReport.totalCost.toLocaleString('id-ID')}
                </span>
              </div>

            </div>
          )}

          <DialogFooter className="pt-2">
            <Button 
              onClick={() => setDetailDialogOpen(false)} 
              className="rounded-xl w-full text-white font-bold h-11 bg-[#0d6e6a] hover:bg-[#0d6e6a]/90 cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              Tutup Rincian Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
