"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, DollarSign, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ClientInvoicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myInvoices, setMyInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/login"); return; }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetch(`${API_BASE_URL}/api/invoices`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((inv: any) => inv.customerId === parsedUser.customerId);
        setMyInvoices(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.62 0.20 175)', borderRightColor: 'oklch(0.60 0.22 264)' }} />
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Memuat tagihan Anda...</p>
      </div>
    );
  }

  const totalUnpaid = myInvoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + Number(i.total), 0);
  const totalPaid = myInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + Number(i.total), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 select-none">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-[#0d2d2a]">
          <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #0d6e6a, #128a85)' }}>
            <Receipt className="h-5 w-5" />
          </span>
          Tagihan Saya
        </h1>
        <p className="mt-1.5 text-sm text-[#577b78]">Daftar tagihan pembayaran untuk layanan servis AC Anda.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-[#0d6e6a]/5"
          style={{ background: 'linear-gradient(135deg, #0d6e6a, #128a85)' }}>
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-white/80" />
            <span className="text-xs text-white/80 font-medium">Total Sudah Lunas</span>
          </div>
          <div className="text-2xl font-extrabold tracking-tight">Rp {totalPaid.toLocaleString('id-ID')}</div>
        </div>
        <div className="rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-red-500/5"
          style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 25) 0%, oklch(0.65 0.20 40) 100%)' }}>
          <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-white/10" />
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-white/80" />
            <span className="text-xs text-white/80 font-medium">Total Belum Dibayar</span>
          </div>
          <div className="text-2xl font-extrabold tracking-tight">Rp {totalUnpaid.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Invoice list */}
      <div className="grid gap-4">
        {myInvoices.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center py-16 gap-4 border-[#e0edea] bg-[#ebf5f3]/20">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-white border border-[#e0edea] shadow-sm">
              <Receipt className="h-8 w-8 text-[#577b78]/50" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-1 text-[#0d2d2a]">Belum Ada Tagihan</h3>
              <p className="text-xs max-w-xs text-[#577b78]">
                Tagihan akan muncul setelah teknisi menyelesaikan pekerjaan servis AC Anda.
              </p>
            </div>
          </div>
        ) : (
          myInvoices.map((inv) => {
            const isPaid = inv.status === 'PAID';
            return (
              <div key={inv.id}
                className="rounded-[2rem] overflow-hidden shadow-xl shadow-[#0d6e6a]/3 bg-white/70 backdrop-blur-xl border border-[#e0edea] hover:shadow-2xl hover:shadow-[#0d6e6a]/6 transition-all duration-300 hover:-translate-y-0.5">
                {/* Top accent bar */}
                <div className="h-1.5" style={{
                  background: isPaid
                    ? 'linear-gradient(90deg, #0d6e6a, #1bb2aa)'
                    : 'linear-gradient(90deg, oklch(0.60 0.22 25), oklch(0.65 0.20 40))'
                }} />
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Left info */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isPaid ? 'rgba(13, 110, 106, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        color: isPaid ? '#0d6e6a' : 'rgba(239, 68, 68, 0.8)',
                      }}>
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#0d2d2a]">{inv.invoiceNumber}</h3>
                      <p className="text-xs text-[#577b78] mt-0.5">Ref: {inv.bookingCode}</p>
                      <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                        style={{
                          background: isPaid ? 'rgba(13, 110, 106, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          color: isPaid ? '#0d6e6a' : 'rgba(239, 68, 68, 0.9)',
                        }}>
                        {isPaid
                          ? <><CheckCircle2 className="h-3 w-3" /> Lunas Dibayar</>
                          : <><Clock className="h-3 w-3" /> Belum Dibayar</>
                        }
                      </span>
                    </div>
                  </div>
                  {/* Right amount + action */}
                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#e0edea]/60">
                    <div>
                      <p className="text-xs mb-0.5 text-[#577b78] font-medium">Total Tagihan</p>
                      <p className="text-2xl font-extrabold text-[#0d2d2a]">
                        <span className="text-sm font-semibold mr-1 text-[#577b78]/60">Rp</span>
                        {Number(inv.total).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {!isPaid ? (
                      <Link href={`/pay/${inv.id}`}>
                        <Button className="gap-2 font-bold rounded-xl h-10 px-5 text-white bg-gradient-to-r from-[#0d6e6a] to-[#128a85] shadow-lg shadow-[#0d6e6a]/15 hover:opacity-95 transition-all text-xs">
                          Bayar Sekarang <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="rounded-xl h-10 px-5 text-xs text-[#577b78]/60 border-[#e0edea]" disabled>
                        Sudah Lunas ✓
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
