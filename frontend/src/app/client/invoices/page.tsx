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
    let userData = null;
    try {
      userData = localStorage.getItem("user");
    } catch (e) {
      console.error(e);
    }
    if (!userData) { router.push("/login"); return; }
    
    let parsedUser = null;
    try {
      parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      console.error(e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }
    fetch(`${API_BASE_URL}/api/invoices`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((inv: any) => 
          parsedUser.customerId ? inv.customerId === parsedUser.customerId : inv.customerName === parsedUser.fullname
        );
        setMyInvoices(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
        <p className="text-xs text-gray-400">Memuat tagihan Anda...</p>
      </div>
    );
  }

  const totalUnpaid = myInvoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + Number(i.total), 0);
  const totalPaid   = myInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + Number(i.total), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 select-none px-4 md:px-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5 text-gray-900">
          <span className="h-9 w-9 rounded-xl flex items-center justify-center text-white bg-gray-900 shadow-sm">
            <Receipt className="h-4.5 w-4.5" />
          </span>
          Tagihan Saya
        </h1>
        <p className="mt-1 text-sm text-gray-400">Daftar tagihan pembayaran untuk layanan servis Anda.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-black/8 bg-gray-900">
          <div className="absolute -top-3 -right-3 h-14 w-14 rounded-full bg-white/8" />
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 font-medium">Total Sudah Lunas</span>
          </div>
          <div className="text-xl font-extrabold tracking-tight">Rp {totalPaid.toLocaleString('id-ID')}</div>
        </div>
        <div className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-red-500/8" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' }}>
          <div className="absolute -top-3 -right-3 h-14 w-14 rounded-full bg-white/8" />
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-white/70" />
            <span className="text-xs text-white/70 font-medium">Total Belum Dibayar</span>
          </div>
          <div className="text-xl font-extrabold tracking-tight">Rp {totalUnpaid.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Invoice list */}
      <div className="grid gap-3">
        {myInvoices.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-16 gap-4 bg-white/50 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gray-100 border border-gray-200">
              <Receipt className="h-7 w-7 text-gray-300" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold mb-1 text-gray-900">Belum Ada Tagihan</h3>
              <p className="text-xs max-w-xs text-gray-400">
                Tagihan akan muncul setelah teknisi menyelesaikan pekerjaan servis Anda.
              </p>
            </div>
          </div>
        ) : (
          myInvoices.map((inv) => {
            const isPaid = inv.status === 'PAID';
            return (
              <div key={inv.id}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:-translate-y-0.5 transition-all duration-300">
                {/* Top accent bar */}
                <div className="h-1" style={{ background: isPaid ? '#111111' : '#dc2626' }} />
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-center gap-3.5">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-500'}`}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">{inv.invoiceNumber}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Ref: {inv.bookingCode}</p>
                      <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        isPaid ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-500'
                      }`}>
                        {isPaid
                          ? <><CheckCircle2 className="h-3 w-3" /> Lunas Dibayar</>
                          : <><Clock className="h-3 w-3" /> Belum Dibayar</>
                        }
                      </span>
                    </div>
                  </div>
                  {/* Right amount + action */}
                  <div className="flex flex-col md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3.5 md:pt-0 border-gray-100">
                    <div>
                      <p className="text-[10px] mb-0.5 text-gray-400 font-medium">Total Tagihan</p>
                      <p className="text-xl font-extrabold text-gray-900">
                        <span className="text-xs font-semibold mr-1 text-gray-400">Rp</span>
                        {Number(inv.total).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {!isPaid ? (
                      <Link href={`/pay/${inv.id}`}>
                        <Button className="gap-2 font-bold rounded-xl h-9 px-5 text-white bg-gray-900 hover:bg-gray-800 shadow-sm transition-all text-xs">
                          Bayar Sekarang <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="rounded-xl h-9 px-5 text-xs text-gray-400 border-gray-200" disabled>
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
