import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email: normalizedEmail } 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });

    return res.status(201).json({
      message: 'User created successfully',
      user
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'A user with this email already exists' 
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}