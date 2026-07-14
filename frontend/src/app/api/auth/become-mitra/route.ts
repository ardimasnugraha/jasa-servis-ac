import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jasa_servis_ac_super_aman_2026';

export async function POST(request: Request) {
  try {
    const { userId, specialty } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Update User Role to TECHNICIAN
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'TECHNICIAN' }
    });

    // Check if technician profile already exists
    let technician = await prisma.technician.findFirst({ where: { userId } });
    if (!technician) {
      // Create new Technician profile
      technician = await prisma.technician.create({
        data: {
          userId,
          specialty: specialty || 'Umum',
          status: 'Aktif',
        }
      });
    } else {
      // Update specialty if it already exists
      technician = await prisma.technician.update({
        where: { id: technician.id },
        data: { specialty: specialty || technician.specialty || 'Umum', status: 'Aktif' }
      });
    }

    const token = jwt.sign(
      { userId: updatedUser.id, role: updatedUser.role, technicianId: technician.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Upgrade akun menjadi Mitra berhasil',
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullname: updatedUser.fullname,
        role: updatedUser.role,
        technicianId: technician.id
      }
    });
  } catch (error) {
    console.error('Error upgrading user to technician:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
