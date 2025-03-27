// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const id = params.id;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        dni: true,
        cuit: true,
        name: true,
        email: true,
        role: true,
        cellphone: true,
      }
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

// PATCH - Update specific fields of a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const id = params.id;
    const data = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Prepare update data
    let updateData: any = {
      name: data.name,
      role: data.role,
      cellphone: data.cellphone,
    };
    
    // If email is changing, check if it conflicts with another user
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { 
          email: data.email,
          id: { not: id } // Exclude current user
        },
      });
      
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use by another user' }, { status: 409 });
      }
      
      updateData.email = data.email;
    }
    
    // If DNI is changing, check if it conflicts with another user
    if (data.dni && data.dni !== existingUser.dni) {
      const dniExists = await prisma.user.findFirst({
        where: { 
          dni: data.dni,
          id: { not: id } // Exclude current user
        },
      });
      
      if (dniExists) {
        return NextResponse.json({ error: 'DNI already in use by another user' }, { status: 409 });
      }
      
      updateData.dni = data.dni;
    }
    
    // If CUIT is provided, update it
    if (data.cuit !== undefined) {
      updateData.cuit = data.cuit;
    }
    
    // If password is provided, hash it
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }
    
    // Validate role if provided
    if (data.role && !Object.values(UserRole).includes(data.role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be ADMIN, EMPLOYEE, or TRANSPORTIST' 
      }, { status: 400 });
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Remove a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const id = params.id;
    
    // Prevent deleting the current user
    if (id === session.user.id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        transportistShipments: {
          take: 1, // Just check if there are any
        },
      },
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has associated shipments
    if (existingUser.transportistShipments.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete user with associated shipments. Reassign shipments first.' 
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