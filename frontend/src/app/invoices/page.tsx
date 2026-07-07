"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, FileText, CreditCard, Copy, CheckCircle2, AlertCircle } from "lucide-react";
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
      setInvoices(await invRes.json());
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
      if (!response.ok) throw new Error("Gagal memproses pembayaran");
      setPayDialogOpen(false);
      fetchData();
    } catch {
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleCopy = (invoiceId: string) => {
    navigator.clipboard.writeText(`http://localhost:3000/pay/${invoiceId}`);
    setCopiedId(invoiceId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const calculatedTotal = (parseFloat(subtotal) || 0) + (parseFloat(tax) || 0) - (parseFloat(discount) || 0);

  const paidCount = invoices.filter(i => i.status === 'PAID').length;
  const unpaidCount = invoices.filter(i => i.status !== 'PAID').length;
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + Number(i.total), 0);

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.60 0.22 25)', borderRightColor: 'oklch(0.60 0.22 264)' }} />
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
              style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))' }}>
              <FileText className="h-5 w-5" />
            </span>
            Invoice
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>Kelola dan pantau tagihan pelanggan.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-xl font-semibold h-10 px-5 text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))', boxShadow: '0 4px 14px oklch(0.60 0.22 25 / 0.35)' }}>
              <Plus className="h-4 w-4" /> Buat Invoice
            </Button>
          } />
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>Terbitkan Invoice Baru</DialogTitle>
              <DialogDescription>Pilih booking selesai untuk ditagihkan ke pelanggan.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Pesanan</Label>
                  <div className="col-span-3">
                    <Select value={bookingId} onValueChange={(val) => setBookingId(val || "")} required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih Pesanan Selesai" /></SelectTrigger>
                      <SelectContent>
                        {bookings.map(b => <SelectItem key={b.id} value={b.id}>{b.bookingCode} — {b.customer}</SelectItem>)}
                        {bookings.length === 0 && <SelectItem value="empty" disabled>Tidak ada servis selesai</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {[
                  { id: 'subtotal', label: 'Subtotal (Rp)', value: subtotal, setter: setSubtotal },
                  { id: 'tax', label: 'Pajak (Rp)', value: tax, setter: setTax },
                  { id: 'discount', label: 'Diskon (Rp)', value: discount, setter: setDiscount },
                ].map(f => (
                  <div key={f.id} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={f.id} className="text-right text-sm">{f.label}</Label>
                    <Input id={f.id} type="number" value={f.value} onChange={e => f.setter(e.target.value)} className="col-span-3 rounded-xl" />
                  </div>
                ))}
                <div className="grid grid-cols-4 items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <Label className="text-right text-sm font-bold">Total</Label>
                  <div className="col-span-3 text-lg font-extrabold" style={{ color: 'oklch(0.58 0.22 264)' }}>
                    Rp {calculatedTotal.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menerbitkan...</> : "Terbitkan Invoice"}
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
            <DialogDescription>Pilih metode pembayaran untuk melunasi tagihan ini.</DialogDescription>
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
      <Card className="rounded-2xl border-0 shadow-lg overflow-hidden" style={{ background: 'var(--card)' }}>
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Daftar Tagihan</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: 'var(--border)' }}>
                {['No. Invoice', 'Pelanggan', 'Total Tagihan', 'Status', 'Aksi'].map((h, i) => (
                  <TableHead key={h} className={`text-xs font-semibold uppercase tracking-wide py-3 px-5 ${i === 4 ? 'text-right' : ''}`}
                    style={{ color: 'var(--muted-foreground)' }}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 && !loading && (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-sm" style={{ color: 'var(--muted-foreground)' }}>Belum ada invoice diterbitkan.</TableCell></TableRow>
              )}
              {invoices.map(inv => {
                const isPaid = inv.status === 'PAID';
                return (
                  <TableRow key={inv.id} className="hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <TableCell className="py-4 px-5">
                      <div className="font-mono text-xs font-bold" style={{ color: 'oklch(0.58 0.22 264)' }}>{inv.invoiceNumber}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Ref: {inv.bookingCode}</div>
                    </TableCell>
                    <TableCell className="py-4 px-5 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{inv.customerName}</TableCell>
                    <TableCell className="py-4 px-5 font-bold text-sm" style={{ color: 'var(--foreground)' }}>
                      Rp {Number(inv.total).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                        background: isPaid ? 'oklch(0.55 0.18 160 / 0.12)' : 'oklch(0.60 0.22 25 / 0.12)',
                        color: isPaid ? 'oklch(0.50 0.18 160)' : 'oklch(0.60 0.22 25)',
                      }}>
                        {isPaid ? 'Lunas' : 'Belum Bayar'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isPaid && (
                          <>
                            <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1"
                              onClick={() => handleCopy(inv.id)}>
                              {copiedId === inv.id ? <><CheckCircle2 className="h-3 w-3 text-green-500" /> Disalin!</> : <><Copy className="h-3 w-3" /> Link</>}
                            </Button>
                            <Button size="sm" className="rounded-xl h-8 text-xs text-white"
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
    </div>
  );
}
