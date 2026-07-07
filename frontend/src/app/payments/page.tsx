"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Search, TrendingUp, ArrowUpRight, CreditCard, Smartphone, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";

type Payment = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  paymentMethod: string;
  amount: string;
  paymentDate: string;
  status: string;
};

const methodIcon: Record<string, React.ReactNode> = {
  'TRANSFER BANK': <CreditCard className="h-4 w-4" />,
  'E-WALLET': <Smartphone className="h-4 w-4" />,
  'CASH': <Banknote className="h-4 w-4" />,
  'CREDIT CARD': <CreditCard className="h-4 w-4" />,
};

const methodColor: Record<string, string> = {
  'TRANSFER BANK': 'bg-blue-500/10 text-blue-600',
  'E-WALLET':      'bg-purple-500/10 text-purple-600',
  'CASH':          'bg-emerald-500/10 text-emerald-600',
  'CREDIT CARD':   'bg-rose-500/10 text-rose-600',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/payments`)
      .then(res => res.json())
      .then(data => { setPayments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    p.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    p.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const todayRevenue = payments
    .filter(p => new Date(p.paymentDate).toDateString() === new Date().toDateString())
    .reduce((s, p) => s + Number(p.amount), 0);

  if (loading && payments.length === 0) {
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
              style={{ background: 'linear-gradient(135deg, #0d6e6a, #128a85)' }}>
              <Wallet className="h-5 w-5" />
            </span>
            Buku Kas
          </h1>
          <p className="mt-1.5 text-sm text-[#577b78]">Catatan seluruh arus uang masuk dari pelanggan.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#577b78]" />
          <Input placeholder="Cari pelanggan atau invoice..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-10 w-64 bg-white/50 border-[#e0edea] text-[#0d2d2a] placeholder:text-[#577b78]/40 focus-visible:ring-[#0d6e6a]" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total Uang Masuk */}
        <div className="rounded-[2rem] p-5 bg-white/70 backdrop-blur-xl border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-[#0d6e6a]/10 flex items-center justify-center text-[#0d6e6a]">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#577b78] uppercase tracking-wider">Semua Waktu</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#0d2d2a] tracking-tight">{`Rp ${totalRevenue.toLocaleString('id-ID')}`}</div>
            <div className="text-xs text-[#577b78] mt-0.5">Total Uang Masuk</div>
          </div>
        </div>

        {/* Masuk Hari Ini */}
        <div className="rounded-[2rem] p-5 bg-white/70 backdrop-blur-xl border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ArrowUpRight className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#577b78] uppercase tracking-wider">Hari Ini</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#0d2d2a] tracking-tight">{`Rp ${todayRevenue.toLocaleString('id-ID')}`}</div>
            <div className="text-xs text-[#577b78] mt-0.5">Masuk Hari Ini</div>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="rounded-[2rem] p-5 bg-white/70 backdrop-blur-xl border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 rounded-xl bg-[#0d6e6a]/10 flex items-center justify-center text-[#0d6e6a]">
              <Wallet className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-bold text-[#577b78] uppercase tracking-wider">Semua Pembayaran</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#0d2d2a] tracking-tight">{payments.length} Transaksi</div>
            <div className="text-xs text-[#577b78] mt-0.5">Total Transaksi Sukses</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-[2rem] border border-[#e0edea] bg-white/70 backdrop-blur-xl shadow-xl shadow-[#0d6e6a]/3 overflow-hidden">
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-bold text-[#0d2d2a]">Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[600px] md:min-w-full">
              <TableHeader>
                <TableRow style={{ borderColor: 'var(--border)' }}>
                  {['Tanggal', 'No. Invoice', 'Pelanggan', 'Metode', 'Nominal', 'Status'].map((h, i) => (
                    <TableHead key={h} className={`text-xs font-semibold uppercase tracking-wide py-3 px-5 text-[#577b78] ${i === 4 ? 'text-right' : ''}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32 text-sm text-[#577b78]">
                      {search ? 'Tidak ada hasil pencarian.' : 'Belum ada riwayat pembayaran.'}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map(p => {
                  const mc = methodColor[p.paymentMethod] || 'bg-muted text-muted-foreground';
                  return (
                    <TableRow key={p.id} className="hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <TableCell className="py-4 px-5 text-xs text-[#577b78]">
                        {new Date(p.paymentDate).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg bg-[#0d6e6a]/10 text-[#0d6e6a]">
                          {p.invoiceNumber}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-5 font-semibold text-sm text-[#0d2d2a]">{p.customerName}</TableCell>
                      <TableCell className="py-4 px-5">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${mc}`}>
                          {methodIcon[p.paymentMethod] || <Wallet className="h-4 w-4" />}
                          {p.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-5 text-right font-extrabold text-[#0d6e6a] text-sm">
                        + Rp {Number(p.amount).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="py-4 px-5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                          Sukses ✓
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
