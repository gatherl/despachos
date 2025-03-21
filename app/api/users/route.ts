import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dni = searchParams.get('dni');
    const email = searchParams.get('email');
    
    if (dni) {
      // Find by DNI
      const user = await prisma.user.findUnique({
        where: { dni },
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json(user);
    }
    
    if (email) {
      // Find by email
      const user = await prisma.user.findFirst({
        where: { email },
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json(user);
    }
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        dni: true,
        cult: true,
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
    const data = await request.json();
    
    // Check for required fields
    const requiredFields = ['dni', 'cult', 'name'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Check if user with the same DNI already exists
    const existingUser = await prisma.user.findUnique({
      where: { dni: data.dni },
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User with this DNI already exists' }, { status: 409 });
    }
    
    // Hash password if provided
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
    // Validate role if provided
    if (data.role && !Object.values(Role).includes(data.role)) {
      return NextResponse.json({ error: 'Invalid role value' }, { status: 400 });
    }
    
    // Create the user
    const newUser = await prisma.user.create({
      data: {
        id: data.id || randomUUID(),
        ...data,
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