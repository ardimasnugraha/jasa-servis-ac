"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2, CheckCircle2, Building2, CreditCard, Receipt, Clock,
  ShieldCheck, Wrench, Copy, Check, Upload, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

export default function CustomerPaymentPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backUrl, setBackUrl] = useState("/client/dashboard");

  // Receipt upload states
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role === "ADMIN") {
          setBackUrl("/invoices");
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/invoices/${id}`)
      .then(res => res.json())
      .then(data => {
        setInvoice(data);
        if (data.status === 'PAID') setPaymentSuccess(true);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const simulatePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/webhooks/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: invoice.id,
          transaction_status: "settlement",
          gross_amount: invoice.total,
          payment_type: "bank_transfer",
        }),
      });
      if (response.ok) {
        setTimeout(() => { setPaymentSuccess(true); setIsProcessing(false); }, 1500);
      } else throw new Error("Webhook failed");
    } catch {
      alert("Simulasi pembayaran gagal.");
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("8077 1234 5678 9012");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadReceipt = async () => {
    if (!receiptPreview) return;
    setIsProcessing(true);
    try {
      // 1. Save Base64 payload to localStorage (shared persistence with same origin admin)
      localStorage.setItem(`payment_proof_${invoice.id}`, receiptPreview);

      // 2. Call backend pay endpoint to update invoice status in PostgreSQL database
      const response = await fetch(`${API_BASE_URL}/api/invoices/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: invoice.total,
          paymentMethod: "TRANSFER MANUAL",
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          setPaymentSuccess(true);
          setIsProcessing(false);
        }, 1200);
      } else {
        throw new Error();
      }
    } catch {
      alert("Gagal mengirim bukti pembayaran.");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, oklch(0.14 0.04 265) 0%, oklch(0.16 0.05 280) 100%)' }}>
        <div className="h-12 w-12 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.60 0.22 264)', borderRightColor: 'oklch(0.62 0.22 295)' }} />
      </div>
    );
  }

  if (!invoice || invoice.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.16 0.05 280))' }}>
        <div className="rounded-2xl p-10 text-center max-w-sm w-full"
          style={{ background: 'oklch(0.20 0.04 265)', border: '1px solid oklch(0.28 0.04 265)' }}>
          <Receipt className="h-12 w-12 mx-auto mb-4" style={{ color: 'oklch(0.60 0.22 25)' }} />
          <h2 className="text-xl font-bold text-white mb-2">Tagihan Tidak Ditemukan</h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.04 265)' }}>
            URL yang Anda kunjungi mungkin salah atau tagihan telah dihapus.
          </p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.16 0.05 185))' }}>
        <div className="rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
          style={{ background: 'oklch(0.18 0.04 265)', border: '1px solid oklch(0.28 0.04 265)' }}>
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, oklch(0.55 0.18 160), oklch(0.62 0.20 175))' }} />
          <div className="p-10 text-center">
            <div className="relative mx-auto mb-6 h-24 w-24">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: 'oklch(0.55 0.18 160)' }} />
              <div className="relative h-24 w-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))' }}>
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil! 🎉</h2>
            <p className="text-sm mb-5" style={{ color: 'oklch(0.65 0.04 265)' }}>
              Terima kasih! Tagihan <span className="font-semibold text-white">{invoice.invoiceNumber}</span> telah lunas.
            </p>

            {/* Display receipt proof in success page */}
            {typeof window !== "undefined" && localStorage.getItem(`payment_proof_${invoice.id}`) && (
              <div className="rounded-xl p-4 mb-5 text-left border border-slate-700/30"
                style={{ background: 'oklch(0.14 0.03 265)' }}>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" /> Bukti Pembayaran Manual Anda
                </span>
                <img 
                  src={localStorage.getItem(`payment_proof_${invoice.id}`) || ""} 
                  alt="Bukti Transfer Pelanggan" 
                  className="w-full h-36 object-contain rounded-lg border border-slate-700/50 bg-slate-900" 
                />
              </div>
            )}

            <div className="rounded-xl p-4 mb-6 text-left space-y-2"
              style={{ background: 'oklch(0.14 0.03 265)', border: '1px solid oklch(0.24 0.04 265)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'oklch(0.65 0.04 265)' }}>Total Bayar</span>
                <span className="font-bold text-white">Rp {Number(invoice.total).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'oklch(0.65 0.04 265)' }}>Metode</span>
                <span className="font-medium text-white">{localStorage.getItem(`payment_proof_${invoice.id}`) ? "Transfer Manual (Struk)" : "Transfer Virtual Account"}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs mb-6"
              style={{ color: 'oklch(0.55 0.18 160)' }}>
              <ShieldCheck className="h-4 w-4" />
              Pembayaran terverifikasi & aman
            </div>
            <div className="pt-2">
              <Link href={backUrl}>
                <Button className="w-full font-bold rounded-xl h-11 text-xs text-white bg-gradient-to-r from-[#0d6e6a] to-[#128a85] shadow-lg shadow-[#0d6e6a]/15 hover:opacity-95 transition-all">
                  Kembali ke Dashboard Pemesanan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4"
      style={{ background: 'linear-gradient(135deg, oklch(0.14 0.04 265) 0%, oklch(0.16 0.05 280) 50%, oklch(0.15 0.04 265) 100%)' }}>
      <div className="max-w-md mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-3 shadow-xl"
            style={{ background: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))' }}>
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Jasa Servis AC Kita</h1>
          <p className="text-sm" style={{ color: 'oklch(0.60 0.06 265)' }}>Sistem Pembayaran Resmi</p>
        </div>

        {/* Invoice amount card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'oklch(0.18 0.04 265)', border: '1px solid oklch(0.26 0.04 265)' }}>
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295), oklch(0.55 0.18 185))' }} />

          <div className="p-6">
            {/* Amount */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'oklch(0.60 0.22 264)' }}>
                  Total Tagihan
                </p>
                <p className="text-4xl font-extrabold text-white">
                  <span className="text-lg font-medium mr-1" style={{ color: 'oklch(0.60 0.06 265)' }}>Rp</span>
                  {Number(invoice.total).toLocaleString('id-ID')}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'oklch(0.68 0.20 55 / 0.15)', color: 'oklch(0.65 0.18 55)' }}>
                Menunggu Bayar
              </span>
            </div>

            {/* Details */}
            <div className="rounded-xl p-4 space-y-2.5 mb-5"
              style={{ background: 'oklch(0.14 0.03 265)', border: '1px solid oklch(0.22 0.04 265)' }}>
              {[
                { label: 'No. Invoice', value: invoice.invoiceNumber },
                { label: 'Pelanggan', value: invoice.customerName },
                { label: 'Kode Booking', value: invoice.bookingCode },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span style={{ color: 'oklch(0.60 0.06 265)' }}>{row.label}</span>
                  <span className="font-semibold text-white">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Virtual Account mockup */}
            <div className="rounded-xl p-5 mb-4 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, oklch(0.22 0.06 264 / 0.5), oklch(0.20 0.04 265))', border: '1px dashed oklch(0.40 0.08 264)' }}>
              <div className="absolute top-2 right-2 opacity-10">
                <CreditCard className="h-20 w-20" style={{ color: 'oklch(0.60 0.22 264)' }} />
              </div>
              <p className="text-xs font-medium mb-2" style={{ color: 'oklch(0.60 0.06 265)' }}>
                Nomor Virtual Account (Simulasi BCA)
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-mono tracking-widest font-bold text-white">
                  8077 1234 5678 9012
                </p>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: copied ? 'oklch(0.55 0.18 160 / 0.2)' : 'oklch(0.58 0.22 264 / 0.15)', color: copied ? 'oklch(0.55 0.18 160)' : 'oklch(0.62 0.22 264)' }}>
                  {copied ? <><Check className="h-3 w-3" /> Disalin!</> : <><Copy className="h-3 w-3" /> Salin</>}
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: 'oklch(0.55 0.06 265)' }}>
                <Clock className="h-3 w-3" /> Berlaku 24 jam
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl p-3.5 flex gap-2.5 text-xs mb-5"
              style={{ background: 'oklch(0.58 0.22 264 / 0.08)', border: '1px solid oklch(0.58 0.22 264 / 0.2)' }}>
              <span className="text-sm mt-0.5">ℹ️</span>
              <p style={{ color: 'oklch(0.75 0.06 265)' }}>
                Setelah mentransfer ke Virtual Account di atas, status invoice akan langsung terdeteksi otomatis menjadi <strong className="text-white">Lunas</strong> menggunakan tombol simulasi di bawah.
              </p>
            </div>

            {/* Action button */}
            <Button
              onClick={simulatePayment}
              disabled={isProcessing}
              className="w-full h-12 text-sm font-bold rounded-xl text-white shadow-xl cursor-pointer"
              style={{ background: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))', boxShadow: '0 8px 30px oklch(0.58 0.22 264 / 0.35)' }}
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses VA...</>
              ) : (
                "✓ Simulasi Bayar Instan (VA)"
              )}
            </Button>

            {/* Manual Upload Section */}
            <div className="mt-5 pt-5 border-t border-slate-700/50 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Upload className="h-4 w-4" style={{ color: 'oklch(0.60 0.22 264)' }} />
                Atau Upload Bukti Pembayaran Manual
              </p>
              
              <div className="rounded-xl p-4 bg-slate-700/10 border border-slate-700/35">
                <input 
                  type="file" 
                  id="receipt-upload" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <label 
                  htmlFor="receipt-upload" 
                  className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700/60 rounded-lg cursor-pointer hover:bg-slate-700/20 transition-all min-h-[90px]"
                >
                  {receiptPreview ? (
                    <img src={receiptPreview} alt="Preview" className="h-28 object-contain rounded-md bg-slate-900 p-1" />
                  ) : (
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center">
                        Pilih File Gambar Struk
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Format JPG, PNG (Maks 5MB)</p>
                    </div>
                  )}
                </label>
                
                {receiptPreview && (
                  <Button
                    onClick={uploadReceipt}
                    disabled={isProcessing}
                    className="w-full mt-3.5 h-10 text-xs font-black rounded-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 cursor-pointer shadow-md"
                  >
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirimkan Bukti...</>
                    ) : (
                      "Kirim Bukti Pembayaran"
                    )}
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'oklch(0.50 0.06 265)' }}>
          <ShieldCheck className="h-4 w-4" style={{ color: 'oklch(0.55 0.18 160)' }} />
          Halaman pembayaran ini aman & terenkripsi
        </div>
      </div>
    </div>
  );
}
