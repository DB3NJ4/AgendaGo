// app/api/dashboard/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar el negocio del usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { businesses: true }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ error: 'No se encontró un negocio' }, { status: 404 })
    }

    const business = user.businesses[0]
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Obtener próximas citas (desde hoy en adelante)
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        businessId: business.id,
        appointmentDate: {
          gte: startOfToday
        },
        status: { in: ['pending', 'confirmed'] }
      },
      include: {
        service: true
      },
      orderBy: {
        appointmentDate: 'asc'
      },
      take: 10 // Limitar a 10 citas
    })

    return NextResponse.json({ appointments: upcomingAppointments })

  } catch (error) {
    console.error('Error fetching upcoming appointments:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}