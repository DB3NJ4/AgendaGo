// app/api/dashboard/activity/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    
    if (!userId || !businessId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el negocio pertenece al usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        businesses: {
          where: { id: businessId }
        }
      }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // Obtener actividades recientes
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        businessId,
        createdAt: {
          gte: oneWeekAgo
        }
      },
      include: {
        service: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    const recentServices = await prisma.service.findMany({
      where: {
        businessId,
        createdAt: {
          gte: oneWeekAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Formatear actividades
    const activities = [
      ...recentAppointments.map(apt => ({
        id: apt.id,
        type: apt.status === 'completed' ? 'appointment_completed' : 
              apt.status === 'cancelled' ? 'appointment_cancelled' : 'appointment_created',
        description: `${apt.customerName} - ${apt.service.name}`,
        timestamp: apt.createdAt.toISOString(),
        amount: apt.status === 'completed' ? apt.service.price : undefined
      })),
      ...recentServices.map(service => ({
        id: service.id,
        type: 'service_created',
        description: `Nuevo servicio: ${service.name}`,
        timestamp: service.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 8) // Mostrar solo las 8 más recientes

    return NextResponse.json({ activities })

  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}