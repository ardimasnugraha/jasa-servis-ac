"use client";
import { API_BASE_URL } from "@/config";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, Users, Calendar, Wrench, Phone, Mail, MapPin } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Customer = {
  id: string;
  fullname: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  acUnits?: {
    id: string;
    brand: string | null;
    type: string | null;
    pk: string | null;
    serialNumber: string | null;
  }[];
  bookings?: {
    id: string;
    bookingCode: string | null;
    bookingDate: string;
    status: string | null;
    complaint: string;
  }[];
};

const avatarGradients = [
  'linear-gradient(135deg, oklch(0.55 0.22 264), oklch(0.50 0.22 278))',
  'linear-gradient(135deg, oklch(0.55 0.18 185), oklch(0.52 0.20 200))',
  'linear-gradient(135deg, oklch(0.55 0.22 295), oklch(0.50 0.22 310))',
  'linear-gradient(135deg, oklch(0.68 0.20 55), oklch(0.63 0.20 40))',
  'linear-gradient(135deg, oklch(0.60 0.22 15), oklch(0.55 0.20 350))',
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchCustomers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/customers`)
      .then(res => res.json())
      .then(data => { setCustomers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, phone, address }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan data pelanggan");
      setFullname(""); setEmail(""); setPhone(""); setAddress("");
      setIsDialogOpen(false);
      fetchCustomers();
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = customers.filter(c =>
    (c.fullname || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'oklch(0.60 0.22 264)', borderRightColor: 'oklch(0.62 0.22 295)' }} />
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
              style={{ background: 'linear-gradient(135deg, oklch(0.60 0.22 264), oklch(0.55 0.22 295))' }}>
              <Users className="h-5 w-5" />
            </span>
            Pelanggan
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Kelola data pelanggan — total <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{customers.length}</span> pelanggan terdaftar.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="gap-2 rounded-xl font-semibold h-10 px-5 text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))', boxShadow: '0 4px 14px oklch(0.58 0.22 264 / 0.35)' }}>
              <Plus className="h-4 w-4" /> Tambah Pelanggan
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
              <DialogDescription>Masukkan informasi pelanggan di sini.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {[
                  { id: 'fullname', label: 'Nama Lengkap', value: fullname, onChange: setFullname, required: true },
                  { id: 'email', label: 'Email', value: email, onChange: setEmail, type: 'email' },
                  { id: 'phone', label: 'No. Telepon', value: phone, onChange: setPhone },
                  { id: 'address', label: 'Alamat', value: address, onChange: setAddress },
                ].map(field => (
                  <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={field.id} className="text-right text-sm">{field.label}</Label>
                    <Input
                      id={field.id}
                      type={(field as any).type || 'text'}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      className="col-span-3 rounded-xl"
                      required={field.required}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))' }}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : "Simpan Pelanggan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail Customer Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Detail Pelanggan: <span className="font-semibold text-[#0d6e6a]">{selectedCustomer?.fullname || 'Tanpa Nama'}</span>
            </DialogTitle>
            <DialogDescription>Profil, aset AC, dan riwayat pesanan servis pelanggan.</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Profil Singkat */}
              <div className="p-4 rounded-xl bg-muted/50 border border-muted space-y-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-[#0d6e6a]/20">
                    <AvatarFallback className="text-lg font-bold text-white bg-[#0d6e6a]">
                      {(selectedCustomer.fullname || 'U').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-base text-foreground">{selectedCustomer.fullname || 'Tanpa Nama'}</h4>
                    <p className="text-xs text-muted-foreground">
                      Bergabung sejak: {new Date(selectedCustomer.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-muted/80 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#0d6e6a]" />
                    <span>{selectedCustomer.phone || "Tidak ada nomor telepon"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#0d6e6a]" />
                    <span className="break-all">{selectedCustomer.email || "Tidak ada email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#0d6e6a] flex-shrink-0" />
                    <span>{selectedCustomer.address || "Tidak ada alamat"}</span>
                  </div>
                </div>
              </div>

              {/* Daftar Aset AC */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold border-b pb-1 flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-[#0d6e6a]" /> Daftar Aset AC ({selectedCustomer.acUnits?.length || 0})
                </h4>
                {selectedCustomer.acUnits && selectedCustomer.acUnits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCustomer.acUnits.map((unit) => (
                      <div key={unit.id} className="p-3 rounded-xl border bg-card text-xs space-y-1">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-[#0d6e6a]">{unit.brand || 'Merek Lain'}</span>
                          <span className="text-muted-foreground">{unit.pk ? `${unit.pk} PK` : '—'}</span>
                        </div>
                        <p className="text-muted-foreground">Tipe: {unit.type || 'Standard'}</p>
                        {unit.serialNumber && (
                          <p className="text-[10px] bg-muted px-1.5 py-0.5 rounded w-max text-muted-foreground font-mono">
                            S/N: {unit.serialNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-muted">
                    Pelanggan ini belum mendaftarkan unit AC.
                  </div>
                )}
              </div>

              {/* Riwayat Pemesanan */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold border-b pb-1 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#0d6e6a]" /> Riwayat Pemesanan ({selectedCustomer.bookings?.length || 0})
                </h4>
                {selectedCustomer.bookings && selectedCustomer.bookings.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {selectedCustomer.bookings.map((booking) => (
                      <div key={booking.id} className="p-3 rounded-xl border bg-card text-xs flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#0d6e6a]">
                              {booking.bookingCode || 'BKG-???'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("id-ID") : '—'})
                            </span>
                          </div>
                          <p className="text-muted-foreground line-clamp-1 italic">"{booking.complaint}"</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: booking.status === 'SELESAI' || booking.status === 'COMPLETED' ? 'oklch(0.55 0.18 160 / 0.12)' : 'oklch(0.70 0.18 75 / 0.12)',
                            color: booking.status === 'SELESAI' || booking.status === 'COMPLETED' ? 'oklch(0.50 0.18 160)' : 'oklch(0.60 0.18 75)',
                          }}>
                          {booking.status === 'SELESAI' || booking.status === 'COMPLETED' ? 'Selesai' : 'Pending/Terjadwal'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-muted">
                    Belum ada riwayat pemesanan servis.
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)} className="rounded-xl w-full text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.58 0.22 264), oklch(0.55 0.22 295))' }}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 rounded-xl h-10"
          style={{ background: 'var(--muted)', border: 'none' }}
        />
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-lg overflow-hidden" style={{ background: 'var(--card)' }}>
        <CardHeader className="pb-3 px-6 pt-5">
          <CardTitle className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
            Daftar Pelanggan
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[600px] md:min-w-full">
              <TableHeader>
                <TableRow style={{ borderColor: 'var(--border)' }}>
                  {['Pelanggan', 'Email', 'Bergabung Pada', 'Aksi'].map((h, i) => (
                    <TableHead key={h} className={`text-xs font-semibold uppercase tracking-wide py-3 px-6 ${i === 3 ? 'text-right' : ''}`}
                      style={{ color: 'var(--muted-foreground)' }}>
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {search ? 'Tidak ada hasil pencarian.' : 'Belum ada data pelanggan.'}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((customer, idx) => (
                  <TableRow key={customer.id} className="transition-colors hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className="text-xs font-bold text-white"
                            style={{ background: avatarGradients[idx % avatarGradients.length] }}>
                            {customer.fullname ? customer.fullname.substring(0, 2).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                            {customer.fullname || "Tanpa Nama"}
                          </div>
                          {customer.phone && (
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{customer.phone}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {customer.email || "—"}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(customer.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl text-xs h-8 px-3 hover:bg-muted font-medium"
                        onClick={() => { setSelectedCustomer(customer); setDetailDialogOpen(true); }}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
