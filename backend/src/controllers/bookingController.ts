import type { Request, Response } from 'express';
import { prisma } from '../prismaClient.js';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
        technician: {
          include: {
            user: true,
          },
        },
      },
    });

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      bookingCode: b.bookingCode,
      customer: b.customer?.fullname || 'Tanpa Nama',
      customerPhone: b.customer?.phone || '-',
      customerEmail: b.customer?.email || '-',
      customerAddress: b.customer?.address || '-',
      complaint: b.complaint || '-',
      status: b.status,
      bookingDate: b.bookingDate,
      bookingTime: b.bookingTime,
      createdAt: b.createdAt,
      technician: b.technician ? {
        id: b.technician.id,
        fullname: b.technician.user?.fullname || 'Tanpa Nama',
        phone: b.technician.user?.phone || '-',
        specialty: b.technician.specialty || '-',
      } : null,
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { customerId, technicianId, bookingDate, bookingTime, complaint } = req.body;

    // Generate Booking Code e.g. BKG-20230706-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingCode = `BKG-${dateStr}-${randomStr}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingCode,
        customerId: customerId || null,
        technicianId: technicianId || null,
        bookingDate: bookingDate ? new Date(bookingDate) : null,
        bookingTime: (bookingTime && bookingTime.includes(':')) ? new Date(`1970-01-01T${bookingTime}:00Z`) : null,
        complaint,
        status: 'MENUNGGU',
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
