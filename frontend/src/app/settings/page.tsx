"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Building2, Phone, MapPin, Bell, Shield, Save } from "lucide-react";

const sections = [
  {
    icon: Building2,
    title: "Profil Perusahaan",
    description: "Informasi ini akan ditampilkan pada faktur / invoice pelanggan.",
    color: '#111111',
    bg: 'rgba(17,17,17,0.06)',
    fields: [
      { id: "companyName", label: "Nama Perusahaan", default: "Jasa Servis AC Kita", icon: Building2 },
      { id: "phone", label: "Nomor Telepon (WhatsApp)", default: "+62 812 3456 7890", icon: Phone },
      { id: "address", label: "Alamat", default: "Jl. Teknologi No. 42, Jakarta", icon: MapPin },
    ],
  },
  {
    icon: Bell,
    title: "Notifikasi",
    description: "Atur preferensi pengiriman notifikasi booking dan pembayaran.",
    color: '#374151',
    bg: 'rgba(55,65,81,0.06)',
    fields: [
      { id: "emailNotif", label: "Email Notifikasi", default: "admin@acservice.com", icon: Bell },
      { id: "waNotif", label: "WhatsApp Notifikasi", default: "+62 812 0000 0001", icon: Phone },
    ],
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Ubah password dan atur keamanan akun admin Anda.",
    color: '#4b5563',
    bg: 'rgba(75,85,99,0.06)',
    fields: [
      { id: "currentPass", label: "Password Saat Ini", default: "", icon: Shield, type: "password", placeholder: "••••••••" },
      { id: "newPass", label: "Password Baru", default: "", icon: Shield, type: "password", placeholder: "••••••••" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl select-none">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-gray-900">
          <span className="h-10 w-10 rounded-xl flex items-center justify-center text-white bg-gray-900">
            <Settings className="h-5 w-5" />
          </span>
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Atur profil perusahaan dan preferensi sistem Anda.
        </p>
      </div>

      {/* Section cards */}
      <div className="space-y-5">
        {sections.map((section, si) => (
          <Card key={si} className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm">
            {/* Top accent */}
            <div className="h-1 bg-gray-200" />

            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: section.bg }}>
                  <section.icon className="h-5 w-5" style={{ color: section.color }} />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-900">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              {section.fields.map(field => (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={field.id} className="text-xs font-semibold text-gray-600">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id={field.id}
                      type={(field as any).type || 'text'}
                      defaultValue={field.default}
                      placeholder={(field as any).placeholder}
                      className="pl-9 rounded-xl h-10 bg-gray-50/50 border border-gray-200 text-gray-900 focus-visible:ring-gray-900"
                    />
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="pt-0 pb-5">
              <Button className="gap-2 rounded-xl h-9 px-5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold shadow-sm">
                <Save className="h-3.5 w-3.5" />
                Simpan {section.title}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* App info card */}
      <div className="rounded-2xl p-5 flex items-center justify-between bg-gray-100/50 border border-gray-200">
        <div>
          <p className="text-xs font-bold text-gray-800">SERVIS KITA Management System</p>
          <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
            Versi 1.0.0 · Build 2026 · Dibuat dengan ❤️
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full animate-pulse bg-gray-900" />
          <span className="text-xs font-medium text-gray-500">Sistem Online</span>
        </div>
      </div>
    </div>
  );
}
