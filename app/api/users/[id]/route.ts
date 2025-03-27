import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET a specific user
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Using await on params to satisfy Next.js requirement
    const { id } = await context.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        dni: true,
        cult: true,
        name: true,
        email: true,
        role: true,
        cellphone: true,
        shipments: {
          select: {
            id: true,
            tracking_id: true,
            state: true,
            creation_date: true,
            destination_city: true,
            destination_state: true,
          },
        },
        received: {
          select: {
            id: true,
            tracking_id: true,
            state: true,
            creation_date: true,
            origin_city: true,
            origin_state: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT - Update a user completely
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // If DNI is being updated, check if it conflicts with another user
    if (data.dni && data.dni !== existingUser.dni) {
      const dniExists = await prisma.user.findUnique({
        where: { dni: data.dni },
      });
      
      if (dniExists) {
        return NextResponse.json({ error: 'User with this DNI already exists' }, { status: 409 });
      }
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
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
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
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// PATCH - Update specific fields of a user
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // If DNI is being updated, check if it conflicts with another user
    if (data.dni && data.dni !== existingUser.dni) {
      const dniExists = await prisma.user.findUnique({
        where: { dni: data.dni },
      });
      
      if (dniExists) {
        return NextResponse.json({ error: 'User with this DNI already exists' }, { status: 409 });
      }
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
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
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
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Remove a user
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        shipments: true,
        received: true,
      },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has associated shipments
    if (existingUser.shipments.length > 0 || existingUser.received.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete user with associated shipments. Remove shipments first.' 
      }, { status: 400 });
    }
    
    // Delete the user
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}