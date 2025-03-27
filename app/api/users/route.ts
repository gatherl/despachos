// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET all users
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get users with appropriate fields
    const users = await prisma.user.findMany({
      select: {
        id: true,
        dni: true,
        cuit: true,
        name: true,
        email: true,
        role: true,
        cellphone: true,
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    
    // Check for required fields
    if (!data.name || !data.email || !data.password || !data.role) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, password, role' 
      }, { status: 400 });
    }
    
    // Check if user with the same email already exists
    const existingEmail = await prisma.user.findFirst({
      where: { email: data.email },
    });
    
    if (existingEmail) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }
    
    // Check if DNI is provided and not already in use
    if (data.dni) {
      const existingDni = await prisma.user.findFirst({
        where: { dni: data.dni },
      });
      
      if (existingDni) {
        return NextResponse.json({ 
          error: 'User with this DNI already exists' 
        }, { status: 409 });
      }
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    // Validate role
    if (!Object.values(UserRole).includes(data.role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be ADMIN, EMPLOYEE, or TRANSPORTIST' 
      }, { status: 400 });
    }
    
    // Create the user
    const newUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        dni: data.dni || null,
        cuit: data.cuit || null,
        cellphone: data.cellphone || null,
      },
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}