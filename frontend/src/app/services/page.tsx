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

import { getAutoPrice } from "@/lib/utils";

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
            <span className="h-10 w-10 rounded-2xl flex items-center justify-center text-white bg-gray-900">
              <BellRing className="h-5.5 w-5.5" />
            </span>
            Laporan Servis
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Catat dan tinjau hasil pengerjaan servis AC Anda.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2.5 rounded-2xl font-bold h-11 px-6 bg-gray-900 text-white hover:bg-gray-800 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
              <Plus className="h-4.5 w-4.5" /> Buat Laporan
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-gray-900">Buat Laporan Servis</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">Isi rincian tindakan yang dilakukan teknisi setelah servis selesai.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 py-3">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold text-gray-900">Pilih Booking</Label>
                  <div className="col-span-3">
                    <Select value={bookingId} onValueChange={(val) => {
                      setBookingId(val || "");
                      if (val) {
                        const selectedB = bookings.find(b => b.id === val);
                        if (selectedB) {
                          setTotalCost(getAutoPrice(selectedB.complaint || selectedB.bookingCode || "").toString());
                        }
                      } else {
                        setTotalCost("0");
                      }
                    }} required>
                      <SelectTrigger className="rounded-xl h-10 border-gray-200 focus:ring-gray-900">
                        <SelectValue placeholder="Pilih Jadwal Servis" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {bookings.map(b => (
                          <SelectItem key={b.id} value={b.id} className="text-xs font-medium my-0.5">
                            {b.bookingCode} — {b.customer}
                          </SelectItem>
                        ))}
                        {bookings.length === 0 && <SelectItem value="empty" disabled className="text-xs">Tidak ada jadwal tertunda</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diagnosis" className="text-right text-xs font-bold text-gray-900">Diagnosis</Label>
                  <Input id="diagnosis" placeholder="Freon kurang, debu menumpuk..." value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)} className="col-span-3 rounded-xl h-10 border-gray-200 focus-visible:ring-gray-900" required />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="actionTaken" className="text-right text-xs font-bold text-gray-900 mt-2.5">Tindakan</Label>
                  <Textarea id="actionTaken" placeholder="Pencucian total dan isi ulang freon..." value={actionTaken}
                    onChange={e => setActionTaken(e.target.value)} className="col-span-3 rounded-xl min-h-[90px] border-gray-200 focus-visible:ring-gray-900" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalCost" className="text-right text-xs font-bold text-gray-900">Total Biaya</Label>
                  <Input id="totalCost" type="number" placeholder="150000" value={totalCost}
                    onChange={e => setTotalCost(e.target.value)} className="col-span-3 rounded-xl h-10 border-gray-200 focus-visible:ring-gray-900" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl h-11 w-full bg-gray-900 hover:bg-gray-800 text-white font-bold cursor-pointer">
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Laporan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards Section (Colorful Blocks to Match Invoice Layout) */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Card 1: Green Card (Total Nilai Servis / Pendapatan) */}
        <div className="rounded-[2rem] p-6 text-white relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01]"
          className="bg-gray-900 text-white">
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-white/5" />
          <CheckCircle2 className="h-5.5 w-5.5 text-white/80" />
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <div className="text-xs text-white/75 font-bold mt-0.5 uppercase tracking-wide">Total Nilai Servis</div>
          </div>
        </div>

        {/* Card 2: Blue/Violet Card (Total Laporan) */}
        <div className="rounded-[2rem] p-6 text-white relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01] bg-gray-700">
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-white/5" />
          <FileText className="h-5.5 w-5.5 text-white/80" />
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight">{reports.length} Laporan</div>
            <div className="text-xs text-white/75 font-bold mt-0.5 uppercase tracking-wide">Total Servis Selesai</div>
          </div>
        </div>

        {/* Card 3: Orange/Red Card (Rata-rata Biaya Servis) */}
        <div className="rounded-[2rem] p-6 text-white relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[125px] transition-all hover:scale-[1.01] bg-gray-800">
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-white/5" />
          <Award className="h-5.5 w-5.5 text-white/80" />
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight">Rp {Math.round(averageRevenue).toLocaleString('id-ID')}</div>
            <div className="text-xs text-white/75 font-bold mt-0.5 uppercase tracking-wide">Rata-rata Per Servis</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] bg-white overflow-hidden">
        
        {/* Table Filter Header */}
        <div className="p-6 pb-4 border-b border-gray-200/55 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">Riwayat Laporan Servis</CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-0.5">Daftar detail penanganan pengerjaan servis AC oleh teknisi.</CardDescription>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari laporan servis..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 h-10 text-xs font-semibold rounded-xl border border-gray-200 focus-visible:ring-gray-900 bg-white/50"
            />
          </div>
        </div>

        {/* Table Area */}
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent" style={{ borderColor: 'var(--border)' }}>
                {['Kode Booking', 'Pelanggan & Teknisi', 'Tindakan', 'Total Biaya', 'Status', 'Aksi'].map((h, i) => (
                  <TableHead key={i} className="text-xs font-bold uppercase tracking-wider py-4 px-6 text-gray-500">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-36 text-sm text-gray-500/70">
                    {searchTerm ? "Tidak ditemukan laporan servis yang cocok dengan pencarian." : "Belum ada riwayat laporan servis."}
                  </TableCell>
                </TableRow>
              )}
              {filteredReports.map(report => (
                <TableRow key={report.id} className="hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  {/* Booking Code */}
                  <TableCell className="py-4.5 px-6">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                      {report.bookingCode}
                    </span>
                  </TableCell>

                  {/* Customer & Technician Info */}
                  <TableCell className="py-4.5 px-6">
                    <div className="font-bold text-sm text-gray-900">{report.customerName}</div>
                    <div className="text-xs mt-0.5 text-gray-500 font-semibold">
                      Teknisi: {report.technicianName && report.technicianName !== "-" ? report.technicianName : "-"}
                    </div>
                  </TableCell>

                  {/* Actions Taken */}
                  <TableCell className="py-4.5 px-6 max-w-[200px]">
                    <p className="text-xs text-gray-500 font-semibold truncate leading-relaxed" title={report.actionTaken}>{report.actionTaken}</p>
                  </TableCell>

                  {/* Total Cost */}
                  <TableCell className="py-4.5 px-6 font-extrabold text-sm text-gray-900 tabular-nums">
                    Rp {Number(report.totalCost).toLocaleString('id-ID')}
                  </TableCell>

                  {/* Status Badge (Soft Green Capsule Layout matching Lunas in Invoice) */}
                  <TableCell className="py-4.5 px-6">
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full w-fit bg-gray-500/10 text-gray-700 border border-emerald-500/15 uppercase tracking-wide">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                    </span>
                  </TableCell>

                  {/* Action Button: Detail File Text icon */}
                  <TableCell className="py-4.5 px-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8.5 w-8.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-gray-900/5 hover:border-[#111111]/15 text-gray-500 hover:text-gray-900 cursor-pointer shadow-sm"
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

      {/* Detail Laporan Dialog (Work Order Style Receipt) */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[480px] select-none rounded-[2rem] border border-gray-200">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-lg font-black text-gray-900 flex items-center gap-2.5">
              <FileText className="h-5.5 w-5.5 text-gray-900" />
              Detail Laporan Servis AC
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">Rincian hasil penanganan masalah teknis unit AC.</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-3 text-xs font-semibold">
              
              {/* Order Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gray-900/5 rounded-full -mr-3 -mt-3" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Kode Booking</span>
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-900 shadow-sm">
                    {selectedReport.bookingCode}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Status Laporan</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-700 border border-emerald-500/15 uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                  </span>
                </div>
              </div>

              {/* Parties involved */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">Detail Pihak Terlibat</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2.5 items-start">
                    <div className="h-8.5 w-8.5 rounded-lg bg-gray-900/5 flex items-center justify-center text-gray-900 border border-[#111111]/10 shrink-0">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nama Pelanggan</p>
                      <p className="font-black text-slate-800 text-sm mt-0.5">{selectedReport.customerName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-8.5 w-8.5 rounded-lg bg-gray-900/5 flex items-center justify-center text-gray-900 border border-[#111111]/10 shrink-0">
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">Diagnosis Masalah AC</h4>
                <div className="p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10 text-rose-800 leading-relaxed flex gap-2.5 items-start">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="font-bold">"{selectedReport.diagnosis}"</p>
                </div>
              </div>

              {/* Action Taken box */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">Tindakan Perbaikan</h4>
                <div className="p-3.5 bg-gray-100/45 rounded-xl border border-gray-200/60 text-slate-700 leading-relaxed italic">
                  "{selectedReport.actionTaken}"
                </div>
              </div>

              {/* Cost summary */}
              <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-gray-200">
                <span className="text-xs font-bold text-slate-600">Total Nilai Pengerjaan:</span>
                <span className="font-black text-base text-gray-900 tabular-nums">
                  Rp {selectedReport.totalCost.toLocaleString('id-ID')}
                </span>
              </div>

            </div>
          )}

          <DialogFooter className="pt-2">
            <Button 
              onClick={() => setDetailDialogOpen(false)} 
              className="rounded-xl w-full text-white font-bold h-11 bg-gray-900 hover:bg-gray-900/90 cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              Tutup Rincian Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
