"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, Users, CheckSquare, TrendingUp, AlertCircle, BarChart3, ArrowUpRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";

type ReportData = {
  totalRevenue: number;
  totalReceivables: number;
  thisMonthRevenue: number;
  totalCustomers: number;
  completedBookings: number;
};

const COLORS = [
  'oklch(0.55 0.18 160)',
  'oklch(0.60 0.22 25)',
];

const weekData = [
  { name: 'Sen', value: 1200 },
  { name: 'Sel', value: 3200 },
  { name: 'Rab', value: 2100 },
  { name: 'Kam', value: 2900 },
  { name: 'Jum', value: 1800 },
  { name: 'Sab', value: 3600 },
  { name: 'Min', value: 4100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border px-4 py-3 shadow-xl text-sm"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
        <p className="font-semibold mb-1">{label}</p>
        <p style={{ color: 'oklch(0.55 0.18 160)' }}>Rp {payload[0].value.toLocaleString('id-ID')}</p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reports/financial`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.55 0.18 160)', borderRightColor: 'oklch(0.58 0.22 264)' }} />
      </div>
    );
  }

  const pieData = [
    { name: 'Sudah Dibayar', value: data?.totalRevenue || 0 },
    { name: 'Piutang', value: data?.totalReceivables || 0 },
  ];

  const statCards = [
    {
      label: 'Total Pemasukan', value: `Rp ${(data?.totalRevenue || 0).toLocaleString('id-ID')}`,
      sub: 'Semua waktu', gradient: 'linear-gradient(135deg, oklch(0.55 0.18 160), oklch(0.52 0.20 185))',
      icon: DollarSign,
    },
    {
      label: 'Pemasukan Bulan Ini', value: `Rp ${(data?.thisMonthRevenue || 0).toLocaleString('id-ID')}`,
      sub: 'Sejak awal bulan', gradient: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))',
      icon: Wallet,
    },
    {
      label: 'Piutang Belum Lunas', value: `Rp ${(data?.totalReceivables || 0).toLocaleString('id-ID')}`,
      sub: 'Harus ditagih', gradient: 'linear-gradient(135deg, oklch(0.60 0.22 25), oklch(0.55 0.20 350))',
      icon: AlertCircle,
    },
    {
      label: 'Servis Selesai', value: `${data?.completedBookings || 0}`,
      sub: `Dari ${data?.totalCustomers || 0} pelanggan`, gradient: 'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))',
      icon: CheckSquare,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
          <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 264), oklch(0.55 0.22 295))' }}>
            <BarChart3 className="h-5 w-5" />
          </span>
          Laporan Keuangan
        </h1>
        <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>Ringkasan performa bisnis dan operasional.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <div key={i} className="rounded-2xl p-5 text-white relative overflow-hidden hover-scale"
            style={{ background: card.gradient, boxShadow: '0 6px 24px oklch(0 0 0 / 0.15)' }}>
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <card.icon className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="text-xl font-bold leading-tight mb-0.5">{card.value}</div>
              <div className="text-sm font-medium text-white/80">{card.label}</div>
              <div className="text-xs text-white/55 mt-0.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Bar chart */}
        <Card className="col-span-4 rounded-2xl border-0 shadow-lg" style={{ background: 'var(--card)' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                Pendapatan Mingguan
              </CardTitle>
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'oklch(0.55 0.18 160 / 0.12)', color: 'oklch(0.50 0.18 160)' }}>
                <TrendingUp className="h-3.5 w-3.5" /> +18.2%
              </span>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.22 264)" stopOpacity={1} />
                      <stop offset="100%" stopColor="oklch(0.55 0.22 295)" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 265 / 0.5)" vertical={false} />
                  <XAxis dataKey="name" stroke="oklch(0.65 0.03 265)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.65 0.03 265)" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary panel */}
        <Card className="col-span-3 rounded-2xl border-0 shadow-lg" style={{ background: 'var(--card)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Ringkasan Eksekutif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dot: 'oklch(0.55 0.18 160)', text: <>Total uang masuk bersih: <strong>Rp {(data?.totalRevenue || 0).toLocaleString('id-ID')}</strong></> },
                { dot: 'oklch(0.58 0.22 264)', text: <>Omset bulan ini: <strong>Rp {(data?.thisMonthRevenue || 0).toLocaleString('id-ID')}</strong></> },
                { dot: 'oklch(0.60 0.22 25)',  text: <>Piutang belum ditagih: <strong style={{ color: 'oklch(0.60 0.22 25)' }}>Rp {(data?.totalReceivables || 0).toLocaleString('id-ID')}</strong></> },
                { dot: 'oklch(0.55 0.22 295)', text: <>{data?.completedBookings || 0} <strong>pesanan servis selesai</strong> dari {data?.totalCustomers || 0} pelanggan.</> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted/50">
                  <div className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.dot }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
