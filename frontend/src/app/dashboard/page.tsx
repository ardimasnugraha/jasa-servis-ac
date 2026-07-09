"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign, Wrench, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
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
    change: "+12.5%",
    changeType: "up",
  },
  {
    title: "Pelanggan Aktif",
    value: `${data?.totalCustomers || 0}`,
    sub: "Pelanggan terdaftar",
    icon: Users,
    change: "+8.2%",
    changeType: "up",
  },
  {
    title: "Servis Hari Ini",
    value: `${data?.todayServices || 0}`,
    sub: "Jadwal servis aktif",
    icon: Wrench,
    change: "+4.1%",
    changeType: "up",
  },
  {
    title: "Servis Pending",
    value: `${data?.pendingServices || 0}`,
    sub: "Booking belum selesai",
    icon: Clock,
    change: "-3.0%",
    changeType: "down",
  },
];

const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
  COMPLETED: { color: "#16a34a", bg: "rgba(22,163,74,0.08)", label: "Selesai" },
  SELESAI:   { color: "#16a34a", bg: "rgba(22,163,74,0.08)", label: "Selesai" },
  PENDING:   { color: "#d97706", bg: "rgba(217,119,6,0.08)",  label: "Menunggu" },
  MENUNGGU:  { color: "#d97706", bg: "rgba(217,119,6,0.08)",  label: "Menunggu" },
  SCHEDULED: { color: "#374151", bg: "rgba(55,65,81,0.08)",   label: "Terjadwal" },
  TERJADWAL: { color: "#374151", bg: "rgba(55,65,81,0.08)",   label: "Terjadwal" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border px-4 py-3 shadow-xl text-xs bg-white border-gray-200 text-gray-900">
        <p className="font-semibold mb-1 text-gray-500">{label}</p>
        <p className="font-bold text-gray-900">Rp {payload[0].value.toLocaleString("id-ID")}</p>
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
        <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  const cards = statCards(data);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-green-500" />
            Live
          </span>
        </div>
        <p className="text-sm text-gray-400">Berikut ringkasan operasional servis hari ini.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative rounded-2xl p-5 bg-white/80 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-default flex flex-col justify-between min-h-[130px] backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <card.icon className="h-4.5 w-4.5 text-gray-700" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                card.changeType === 'up' ? 'bg-gray-900/5 text-gray-700' : 'bg-red-50 text-red-500'
              }`}>
                {card.changeType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {card.change}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400">{card.title}</div>
              <div className="text-2xl font-extrabold text-gray-900 mt-0.5 tracking-tight">{card.value}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue chart */}
        <Card className="col-span-4 rounded-2xl border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm pb-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-gray-900">
                Overview Pendapatan Mingguan
              </CardTitle>
              <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                <TrendingUp className="h-3 w-3" />
                +18.2% vs minggu lalu
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={defaultData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#111111"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    dot={{ fill: '#111111', strokeWidth: 2, r: 3, stroke: '#ffffff' }}
                    activeDot={{ r: 4.5, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card className="col-span-3 rounded-2xl border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-900">Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(!data?.recentBookings || data.recentBookings.length === 0) && (
                <div className="text-center py-8 rounded-xl bg-gray-50">
                  <Wrench className="h-7 w-7 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs text-gray-400">Belum ada pemesanan.</p>
                </div>
              )}
              {data?.recentBookings?.map((booking) => {
                const style = statusStyles[booking.status] || { color: "#6b7280", bg: "rgba(107,114,128,0.08)", label: booking.status };
                return (
                  <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-[10px] font-bold text-white bg-gray-900">
                        {booking.customer.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate text-gray-900">{booking.customer}</p>
                      <p className="text-[10px] truncate text-gray-400">{booking.type}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] text-gray-400">{booking.date}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: style.bg, color: style.color }}>
                        {style.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
