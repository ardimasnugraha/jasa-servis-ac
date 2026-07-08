"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FileText, CreditCard, Copy, CheckCircle2, AlertCircle, Eye, ImageIcon, Check } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Invoice = {
  id: string;
  invoiceNumber: string;
  bookingCode: string;
  customerName: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER BANK");
  const [isPaying, setIsPaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // States for viewing payment proof receipts
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [selectedProofInvoice, setSelectedProofInvoice] = useState<Invoice | null>(null);
  const [selectedProofBase64, setSelectedProofBase64] = useState<string | null>(null);
  const [proofsMap, setProofsMap] = useState<Record<string, boolean>>({});

  const [bookingId, setBookingId] = useState("");
  const [subtotal, setSubtotal] = useState("0");
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [invRes, bRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/invoices`),
        fetch(`${API_BASE_URL}/api/bookings`),
      ]);
      const invData = await invRes.json();
      setInvoices(invData);
      const bData = await bRes.json();
      setBookings(bData.filter((b: any) => b.status === 'SELESAI'));
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync proofsMap from localStorage client-side to prevent hydration mismatch
  useEffect(() => {
    const map: Record<string, boolean> = {};
    invoices.forEach(inv => {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(`payment_proof_${inv.id}`);
        if (item) map[inv.id] = true;
      }
    });
    setProofsMap(map);
  }, [invoices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, subtotal, tax, discount }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan invoice");
      setBookingId(""); setSubtotal("0"); setTax("0"); setDiscount("0");
      setIsDialogOpen(false);
      fetchData();
    } catch {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoices/${selectedInvoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      });
      if (!response.ok) throw new Error();
      setPayDialogOpen(false);
      fetchData();
    } catch {
      alert("Gagal melunasi invoice.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleCopy = (id: string) => {
    const payUrl = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(payUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const paidCount = invoices.filter(i => i.status === 'PAID').length;
  const unpaidCount = invoices.length - paidCount;
  const totalRevenue = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + Number(i.total), 0);

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.60 0.22 264)', borderRightColor: 'oklch(0.55 0.18 160)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-[#0d2d2a]">
            <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))' }}>
              <FileText className="h-5 w-5" />
            </span>
            Invoice
          </h1>
          <p className="mt-1.5 text-sm text-[#577b78]">Kelola dan pantau tagihan pelanggan.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-2xl font-bold h-11 px-6 text-white cursor-pointer transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))', boxShadow: '0 4px 14px oklch(0.60 0.22 25 / 0.3)' }}>
              <Plus className="h-4.5 w-4.5" /> Buat Invoice
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Invoice Baru</DialogTitle>
              <DialogDescription>Masukkan rincian biaya untuk menerbitkan invoice baru.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Pilih Booking</Label>
                  <div className="col-span-3">
                    <Select value={bookingId} onValueChange={(val) => setBookingId(val || "")} required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih nomor booking" /></SelectTrigger>
                      <SelectContent>
                        {bookings.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.bookingCode} — {b.customer}</SelectItem>
                        ))}
                        {bookings.length === 0 && <SelectItem value="empty" disabled>Tidak ada jadwal servis selesai</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {[
                  { id: 'subtotal', label: 'Subtotal', value: subtotal, setter: setSubtotal },
                  { id: 'tax', label: 'Pajak (PPN)', value: tax, setter: setTax },
                  { id: 'discount', label: 'Diskon', value: discount, setter: setDiscount },
                ].map(field => (
                  <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={field.id} className="text-right text-sm">{field.label}</Label>
                    <Input id={field.id} type="number" value={field.value} onChange={e => field.setter(e.target.value)} className="col-span-3 rounded-xl" required />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white w-full h-11 font-bold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Terbitkan Invoice"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, gradient: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))', icon: CheckCircle2 },
          { label: 'Invoice Lunas', value: paidCount, gradient: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))', icon: FileText },
          { label: 'Belum Dibayar', value: unpaidCount, gradient: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))', icon: AlertCircle },
        ].map((card, i) => (
          <div key={i} className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: card.gradient, boxShadow: '0 4px 20px oklch(0 0 0 / 0.15)' }}>
            <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
            <card.icon className="h-5 w-5 text-white/70 mb-2" />
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-white/70">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription>Pilih metode pembayaran untuk melunasi tagihan ini secara langsung.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePayInvoice}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm">Metode</Label>
                <div className="col-span-3">
                  <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val || "")} required>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['TRANSFER BANK', 'CASH', 'E-WALLET', 'CREDIT CARD'].map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPaying} className="rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
                {isPaying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : <><CreditCard className="mr-2 h-4 w-4" /> Lunasi Sekarang</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card className="rounded-[2rem] border border-[#e0edea] bg-white overflow-hidden shadow-sm">
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-bold text-[#0d2d2a]">Daftar Tagihan</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow style={{ borderColor: 'var(--border)' }}>
                {['No. Invoice', 'Pelanggan', 'Total Tagihan', 'Status', 'Aksi'].map((h, i) => (
                  <TableHead key={h} className={`text-xs font-bold uppercase tracking-wider py-4 px-6 text-[#577b78] ${i === 4 ? 'text-right' : ''}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 && !loading && (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-sm text-[#577b78]" style={{ color: 'var(--muted-foreground)' }}>Belum ada invoice diterbitkan.</TableCell></TableRow>
              )}
              {invoices.map(inv => {
                const isPaid = inv.status === 'PAID';
                return (
                  <TableRow key={inv.id} className="hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <TableCell className="py-4.5 px-6">
                      <div className="font-mono text-xs font-bold text-[#0d6e6a]">{inv.invoiceNumber}</div>
                      <div className="text-xs mt-0.5 text-[#577b78]">Ref: {inv.bookingCode}</div>
                    </TableCell>
                    <TableCell className="py-4.5 px-6 font-bold text-sm text-[#0d2d2a]">{inv.customerName}</TableCell>
                    <TableCell className="py-4.5 px-6 font-extrabold text-sm text-[#0d2d2a]">
                      Rp {Number(inv.total).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="py-4.5 px-6">
                      <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{
                        background: isPaid ? 'oklch(0.55 0.18 160 / 0.12)' : 'oklch(0.60 0.22 25 / 0.12)',
                        color: isPaid ? 'oklch(0.50 0.18 160)' : 'oklch(0.60 0.22 25)',
                      }}>
                        {isPaid ? 'Lunas' : 'Belum Bayar'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPaid ? (
                          proofsMap[inv.id] && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl h-8.5 px-3 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/25 cursor-pointer font-bold flex items-center gap-1 shadow-sm"
                              onClick={() => {
                                const proof = localStorage.getItem(`payment_proof_${inv.id}`);
                                setSelectedProofInvoice(inv);
                                setSelectedProofBase64(proof);
                                setProofDialogOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" /> Lihat Bukti
                            </Button>
                          )
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1 border-[#e0edea] text-[#577b78] hover:bg-slate-50 cursor-pointer"
                              onClick={() => handleCopy(inv.id)}>
                              {copiedId === inv.id ? <><Check className="h-3.5 w-3.5 text-green-500" /> Disalin!</> : <><Copy className="h-3.5 w-3.5" /> Link</>}
                            </Button>
                            <Button size="sm" className="rounded-xl h-8 text-xs text-white cursor-pointer transition-all active:scale-[0.98]"
                              style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}
                              onClick={() => { setSelectedInvoiceId(inv.id); setPaymentMethod("TRANSFER BANK"); setPayDialogOpen(true); }}>
                              Bayar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Proof Dialog */}
      <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[2rem] border border-[#e0edea] select-none">
          <DialogHeader className="border-b border-[#e0edea] pb-3">
            <DialogTitle className="text-base font-extrabold text-[#0d2d2a] flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
              Bukti Transfer Pembayaran
            </DialogTitle>
            <DialogDescription className="text-xs text-[#577b78]">Dokumen berkas struk transfer pembayaran manual pelanggan.</DialogDescription>
          </DialogHeader>
          {selectedProofInvoice && (
            <div className="space-y-4 py-2 font-semibold">
              <div className="grid grid-cols-2 text-xs gap-y-2 p-4 bg-slate-50 border border-[#e0edea] rounded-2xl">
                <span className="text-slate-400">No. Invoice</span>
                <span className="text-[#0d2d2a] text-right font-bold">{selectedProofInvoice.invoiceNumber}</span>
                <span className="text-slate-400">Nama Pelanggan</span>
                <span className="text-[#0d2d2a] text-right">{selectedProofInvoice.customerName}</span>
                <span className="text-slate-400">Total Nominal</span>
                <span className="text-[#0d2d2a] text-right font-extrabold">Rp {Number(selectedProofInvoice.total).toLocaleString('id-ID')}</span>
              </div>
              <div className="border border-[#e0edea] rounded-2xl overflow-hidden shadow-sm bg-slate-50 p-2 flex items-center justify-center min-h-[220px]">
                <img 
                  src={selectedProofBase64 || ""} 
                  alt="Bukti Transfer Pelanggan" 
                  className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm border border-[#e0edea]/60 bg-white" 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => setProofDialogOpen(false)} 
              className="rounded-xl w-full text-white font-bold h-11 bg-[#0d6e6a] hover:bg-[#0d6e6a]/90 cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              Tutup Berkas Struk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
