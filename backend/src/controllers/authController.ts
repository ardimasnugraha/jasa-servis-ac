import type { Request, Response } from 'express';
import { prisma } from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_jasa_servis_ac_super_aman_2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullname, phone, address } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
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

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role,
        customerId: customer.id
      }
    });
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // If role is USER, find associated customer id
    let customerId = null;
    if (user.role === 'USER') {
      const customer = await prisma.customer.findFirst({ where: { email: user.email } });
      if (customer) {
        customerId = customer.id;
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, customerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        customerId
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
