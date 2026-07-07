"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BellRing, FileText, CheckCircle2 } from "lucide-react";
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
      console.error(err);
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
        body: JSON.stringify({ bookingId, technicianId: selectedBooking?.technicianId || null, diagnosis, actionTaken, totalCost }),
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>Catat hasil pengerjaan servis AC Anda.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-xl font-semibold h-10 px-5 text-white"
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
                        {bookings.map(b => <SelectItem key={b.id} value={b.id}>{b.bookingCode} — {b.customer}</SelectItem>)}
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
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white"
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
        <div className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))' }}>
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <BellRing className="h-5 w-5 text-white/70 mb-2" />
          <div className="text-2xl font-bold">{reports.length} Laporan</div>
          <div className="text-sm text-white/70">Total servis selesai</div>
        </div>
        <div className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <CheckCircle2 className="h-5 w-5 text-white/70 mb-2" />
          <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          <div className="text-sm text-white/70">Total nilai servis</div>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-lg overflow-hidden" style={{ background: 'var(--card)' }}>
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Riwayat Laporan Servis</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: 'var(--border)' }}>
                {['Kode', 'Pelanggan & Teknisi', 'Tindakan', 'Total Biaya', 'Status', ''].map((h, i) => (
                  <TableHead key={i} className="text-xs font-semibold uppercase tracking-wide py-3 px-5"
                    style={{ color: 'var(--muted-foreground)' }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Belum ada riwayat laporan servis.
                  </TableCell>
                </TableRow>
              )}
              {reports.map(report => (
                <TableRow key={report.id} className="hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <TableCell className="py-4 px-5">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg"
                      style={{ background: 'oklch(0.68 0.20 55 / 0.1)', color: 'oklch(0.60 0.18 55)' }}>
                      {report.bookingCode}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{report.customerName}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Teknisi: {report.technicianName}</div>
                  </TableCell>
                  <TableCell className="py-4 px-5 max-w-[200px]">
                    <p className="text-sm truncate" style={{ color: 'var(--muted-foreground)' }}>{report.actionTaken}</p>
                  </TableCell>
                  <TableCell className="py-4 px-5 font-bold text-sm" style={{ color: 'var(--foreground)' }}>
                    Rp {Number(report.totalCost).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="py-4 px-5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                      style={{ background: 'oklch(0.55 0.18 160 / 0.12)', color: 'oklch(0.50 0.18 160)' }}>
                      <CheckCircle2 className="h-3 w-3" /> Selesai
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-5 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                      <FileText className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
