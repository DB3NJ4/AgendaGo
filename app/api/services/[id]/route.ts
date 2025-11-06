// app/api/services/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = getAuth(request)
    const { id } = await params
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, duration, price, category, isActive } = body

    // Verificar que el servicio pertenezca al usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        businesses: {
          include: {
            services: {
              where: { id }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0 || user.businesses[0].services.length === 0) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    // Actualizar el servicio
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(duration && { duration: parseInt(duration) }),
        ...(price && { price: parseInt(price) }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({ service })

  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = getAuth(request)
    const { id } = await params
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el servicio pertenezca al usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        businesses: {
          include: {
            services: {
              where: { id }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0 || user.businesses[0].services.length === 0) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    // Eliminar el servicio
    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = getAuth(request)
    const { id } = await params
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = body

    // Verificar que el servicio pertenezca al usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        businesses: {
          include: {
            services: {
              where: { id }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0 || user.businesses[0].services.length === 0) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    // Actualizar solo el estado
    const service = await prisma.service.update({
      where: { id },
      data: { isActive }
    })

    return NextResponse.json({ service })

  } catch (error) {
    console.error('Error updating service status:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}