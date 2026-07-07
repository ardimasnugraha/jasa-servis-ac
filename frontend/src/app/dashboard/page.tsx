"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign, Wrench, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  Area, AreaChart
} from "recharts";

type DashboardData = {
  totalRevenue: number;
  totalCustomers: number;
  todayServices: number;
  pendingServices: number;
  recentBookings: {
    id: string;
    customer: string;
    type: string;
    status: string;
    date: string;
  }[];
};

const defaultData = [
  { name: "Sen", total: 1200 },
  { name: "Sel", total: 3200 },
  { name: "Rab", total: 2100 },
  { name: "Kam", total: 2900 },
  { name: "Jum", total: 1800 },
  { name: "Sab", total: 3600 },
  { name: "Min", total: 4100 },
];

const statCards = (data: DashboardData | null) => [
  {
    title: "Total Pendapatan",
    value: `Rp ${(data?.totalRevenue || 0).toLocaleString("id-ID")}`,
    sub: "Dari seluruh invoice lunas",
    icon: DollarSign,
    iconBg: "bg-emerald-50 text-emerald-600",
    change: "+12.5%",
    changeType: "up",
  },
  {
    title: "Pelanggan Aktif",
    value: `${data?.totalCustomers || 0}`,
    sub: "Pelanggan terdaftar",
    icon: Users,
    iconBg: "bg-blue-50 text-blue-500",
    change: "+8.2%",
    changeType: "up",
  },
  {
    title: "Servis Hari Ini",
    value: `${data?.todayServices || 0}`,
    sub: "Jadwal servis aktif",
    icon: Wrench,
    iconBg: "bg-purple-50 text-purple-500",
    change: "+4.1%",
    changeType: "up",
  },
  {
    title: "Servis Pending",
    value: `${data?.pendingServices || 0}`,
    sub: "Booking belum selesai",
    icon: Clock,
    iconBg: "bg-amber-50 text-amber-500",
    change: "-3.0%",
    changeType: "down",
  },
];

const statusColor: Record<string, string> = {
  COMPLETED: "oklch(0.60 0.18 160)",
  SELESAI:   "oklch(0.60 0.18 160)",
  PENDING:   "oklch(0.70 0.18 75)",
  MENUNGGU:  "oklch(0.70 0.18 75)",
  SCHEDULED: "oklch(0.45 0.14 185)",
  TERJADWAL: "oklch(0.45 0.14 185)",
};

const statusBg: Record<string, string> = {
  COMPLETED: "oklch(0.60 0.18 160 / 0.12)",
  SELESAI:   "oklch(0.60 0.18 160 / 0.12)",
  PENDING:   "oklch(0.70 0.18 75 / 0.12)",
  MENUNGGU:  "oklch(0.70 0.18 75 / 0.12)",
  SCHEDULED: "oklch(0.45 0.14 185 / 0.12)",
  TERJADWAL: "oklch(0.45 0.14 185 / 0.12)",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border px-4 py-3 shadow-xl text-sm bg-white border-[#e0edea] text-[#0d2d2a]">
        <p className="font-semibold mb-1">{label}</p>
        <p className="font-bold text-[#0d6e6a]">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/summary`)
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: 'oklch(0.45 0.14 185)', borderRightColor: 'oklch(0.55 0.18 200)' }} />
          <div className="absolute inset-2 rounded-full border border-transparent animate-spin animation-delay-150"
            style={{ borderTopColor: 'oklch(0.70 0.15 310)', animationDirection: 'reverse' }} />
        </div>
      </div>
    );
  }

  const cards = statCards(data);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0d2d2a]">
            Dashboard
          </h1>
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ebf5f3] text-[#0d6e6a]">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-[#0d6e6a]" />
            Live
          </span>
        </div>
        <p className="text-[#577b78]">
          Selamat datang kembali! Berikut ringkasan operasional servis AC hari ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative rounded-3xl p-5 bg-white/75 border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] overflow-hidden hover-scale cursor-default flex flex-col justify-between min-h-[140px]"
          >
            <div className="relative z-10 w-full flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-2xl ${card.iconBg.split(' ')[0]} flex items-center justify-center`}>
                  <card.icon className={`h-4.5 w-4.5 ${card.iconBg.split(' ')[1]}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                  card.changeType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                  <ArrowUpRight className="h-3 w-3" />
                  {card.change}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#577b78]">{card.title}</div>
                <div className="text-2xl font-extrabold text-[#0d2d2a] mt-0.5 tracking-tight">{card.value}</div>
                <div className="text-[10px] text-[#577b78]/60 mt-1">{card.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue chart */}
        <Card className="col-span-4 rounded-3xl border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] bg-white/75 backdrop-blur-md pb-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#0d2d2a]">
                Overview Pendapatan Mingguan
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ebf5f3] text-[#0d6e6a]">
                <TrendingUp className="h-3.5 w-3.5" />
                +18.2% vs minggu lalu
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={defaultData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.45 0.14 185)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="oklch(0.45 0.14 185)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(13, 110, 106, 0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#577b78"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#577b78"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="oklch(0.45 0.14 185)"
                    strokeWidth={2.5}
                    fill="url(#colorRevenue)"
                    dot={{ fill: 'oklch(0.45 0.14 185)', strokeWidth: 1.5, r: 3.5, stroke: '#ffffff' }}
                    activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card className="col-span-3 rounded-3xl border border-[#e0edea] shadow-[0_8px_30px_rgba(13,110,106,0.02)] bg-white/75 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-[#0d2d2a]">
              Booking Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(!data?.recentBookings || data.recentBookings.length === 0) && (
                <div className="text-center py-8 rounded-xl" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  <Wrench className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Belum ada pemesanan.</p>
                </div>
              )}
              {data?.recentBookings?.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback
                      className="text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, oklch(0.45 0.14 185), oklch(0.55 0.18 200))' }}
                    >
                      {booking.customer.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-[#0d2d2a]">
                      {booking.customer}
                    </p>
                    <p className="text-xs truncate text-[#577b78]">
                      {booking.type}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-[#577b78]">{booking.date}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: statusBg[booking.status] || 'var(--muted)',
                        color: statusColor[booking.status] || 'var(--muted-foreground)',
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
