| Layer               | Technology                                                  |
| ------------------- | ----------------------------------------------------------- |
| Frontend            | Next.js 15 (App Router), TypeScript, TailwindCSS, Shadcn UI |
| Backend             | Node.js, Express.js, TypeScript                             |
| Database            | PostgreSQL (Supabase)                                       |
| ORM                 | Prisma ORM                                                  |
| Authentication      | Supabase Auth + JWT                                         |
| Storage             | Supabase Storage                                            |
| Realtime            | Supabase Realtime                                           |
| Email               | Resend / Nodemailer                                         |
| Deployment Frontend | Vercel                                                      |
| Deployment Backend  | Railway / Render                                            |
| Monitoring          | Sentry                                                      |
| API                 | REST API                                                    |

# AC Service CRM

## Deskripsi

Aplikasi CRM dan Manajemen Jasa Servis AC untuk UMKM.

Fitur utama:

- Booking Servis
- Manajemen Pelanggan
- Teknisi
- Jadwal Teknisi
- Invoice
- Pembayaran
- CRM
- Reminder Servis Berkala
- Dashboard
- Laporan
- Multi User

---

# Arsitektur

Client (Next.js App)
      │
 Next.js API Routes (Route Handlers)
      │
  Prisma ORM
      │
PostgreSQL (Supabase)

Storage
│
Supabase Storage

Authentication
│
Next.js JWT Auth + Supabase

Realtime
│
Supabase Realtime

---

# Folder Structure

frontend/ (Aplikasi Unified Next.js)

src/
  app/
    api/              <-- Next.js API Route Handlers (Backend)
      auth/
        login/
        register/
      bookings/
      customers/
      dashboard/
      invoices/
      payments/
      reports/
      technicians/
      webhooks/
    (pages...)
  components/
  lib/
  config.ts
prisma/               <-- Prisma ORM Schema & Migrations

---

# Role

Admin

Owner

CS

Teknisi

Customer

---

# Modul

Dashboard

Customer

CRM

Booking

Jadwal Teknisi

Servis

Invoice

Pembayaran

Laporan

Master Data

User Management

Setting

---

# Customer Flow

Customer Booking

↓

Admin menerima booking

↓

Menentukan Teknisi

↓

Teknisi menerima order

↓

Menuju Lokasi

↓

Pengerjaan

↓

Input hasil servis

↓

Invoice dibuat

↓

Pembayaran

↓

CRM Reminder

---

# Dashboard

Total Customer

Servis Hari Ini

Pending

Selesai

Invoice Belum Lunas

Omset

Teknisi Aktif

Grafik Pendapatan

Grafik Booking

---

# CRM

Riwayat Customer

Reminder Servis

Follow Up

Broadcast WhatsApp

Email

Catatan Customer

Rating

---

# Booking

Nama

Alamat

No HP

Jenis AC

Keluhan

Tanggal

Jam

Status

---

# Teknisi

Data Teknisi

Jadwal

Lokasi

Status

Komisi

Riwayat Servis

---

# Servis

Checklist

Foto Sebelum

Foto Sesudah

Sparepart

Biaya

Catatan

Status

---

# Invoice

Generate Otomatis

PDF

Kirim WhatsApp

Kirim Email

QRIS

Transfer

Cash

---

# Pembayaran

Belum Bayar

DP

Lunas

Refund

---

# Laporan

Pendapatan

Servis

Teknisi

Customer

Invoice

Sparepart

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    password TEXT,
    role VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(150),
    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    specialty VARCHAR(100),
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE ac_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    brand VARCHAR(100),
    type VARCHAR(100),
    pk VARCHAR(50),
    serial_number VARCHAR(100),
    installation_date DATE,
    last_service DATE,
    notes TEXT
);
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(50) UNIQUE,
    customer_id UUID REFERENCES customers(id),
    technician_id UUID REFERENCES technicians(id),
    booking_date DATE,
    booking_time TIME,
    complaint TEXT,
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE service_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    technician_id UUID REFERENCES technicians(id),
    diagnosis TEXT,
    action_taken TEXT,
    recommendations TEXT,
    before_photo TEXT,
    after_photo TEXT,
    total_cost NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE spareparts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150),
    stock INTEGER,
    price NUMERIC(12,2)
);
CREATE TABLE service_spareparts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES service_reports(id),
    sparepart_id UUID REFERENCES spareparts(id),
    qty INTEGER,
    price NUMERIC(12,2)
);
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    invoice_number VARCHAR(100) UNIQUE,
    subtotal NUMERIC(12,2),
    tax NUMERIC(12,2),
    discount NUMERIC(12,2),
    total NUMERIC(12,2),
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id),
    payment_method VARCHAR(50),
    amount NUMERIC(12,2),
    payment_date TIMESTAMP,
    status VARCHAR(30)
);
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    ac_unit_id UUID REFERENCES ac_units(id),
    reminder_date DATE,
    status VARCHAR(30)
);
CREATE TABLE crm_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    user_id UUID REFERENCES users(id),
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE customer_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    rating INTEGER,
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
users
   │
   └──── technicians

customers
   │
   ├──── ac_units
   ├──── bookings
   ├──── reminders
   ├──── crm_notes
   └──── customer_ratings

technicians
   │
   ├──── bookings
   └──── service_reports

bookings
   │
   ├──── service_reports
   └──── invoices

service_reports
   │
   └──── service_spareparts

spareparts
   │
   └──── service_spareparts

invoices
   │
   └──── payments

POST   /api/auth/login
POST   /api/auth/register

GET    /api/customers
POST   /api/customers

GET    /api/bookings
POST   /api/bookings

GET    /api/technicians
POST   /api/technicians

GET    /api/service-reports
POST   /api/service-reports

GET    /api/invoices
POST   /api/invoices

GET    /api/payments
POST   /api/payments

GET    /api/reminders
POST   /api/reminders

GET    /api/dashboard
GET    /api/reports