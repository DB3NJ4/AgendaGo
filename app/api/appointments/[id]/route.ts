// app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = getAuth(request)
    const { id } = await params
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    // Verificar que la cita pertenezca al usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        businesses: {
          include: {
            appointments: {
              where: { id }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0 || user.businesses[0].appointments.length === 0) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    }

    // Actualizar el estado
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        service: true
      }
    })

    return NextResponse.json({ appointment })

  } catch (error) {
    console.error('Error updating appointment:', error)
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

    // Verificar que la cita pertenezca al usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        businesses: {
          include: {
            appointments: {
              where: { id }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0 || user.businesses[0].appointments.length === 0) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    }

    // Eliminar la cita
    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}