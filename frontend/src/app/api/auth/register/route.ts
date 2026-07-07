import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jasa_servis_ac_super_aman_2026';

export async function POST(request: Request) {
  try {
    const { email, password, fullname, phone, address } = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User (Role default = USER)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullname: fullname,
        role: 'USER',
      }
    });

    // Check if customer profile already exists (e.g. created manually by admin)
    let customer = await prisma.customer.findFirst({ where: { email } });

    if (customer) {
      // If customer exists, update fields if currently blank
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          phone: customer.phone || phone || '',
          address: customer.address || address || '',
        }
      });
    } else {
      // If customer does not exist, create a new profile
      customer = await prisma.customer.create({
        data: {
          email,
          fullname,
          phone: phone || '',
          address: address || '',
        }
      });
    }

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, customerId: customer.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role,
        customerId: customer.id
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
