import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jasa_servis_ac_super_aman_2026';

export async function POST(request: Request) {
  try {
    const { email, password, fullname, phone, address, specialty } = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User (Role = TECHNICIAN)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullname,
        phone,
        role: 'TECHNICIAN',
      }
    });

    // Create Technician profile
    const newTechnician = await prisma.technician.create({
      data: {
        userId: newUser.id,
        specialty: specialty || 'Umum',
        status: 'Aktif',
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, technicianId: newTechnician.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Registrasi Mitra berhasil',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role,
        technicianId: newTechnician.id
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering technician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
