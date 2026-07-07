import type { Request, Response } from 'express';
import { prisma } from '../prismaClient.js';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        bookings: {
          orderBy: {
            bookingDate: 'desc',
          },
        },
        acUnits: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { fullname, email, phone, address } = req.body;

    const newCustomer = await prisma.customer.create({
      data: {
        fullname,
        email,
        phone,
        address,
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
