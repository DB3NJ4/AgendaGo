// app/api/dashboard/stats/route.ts
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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfTomorrow = new Date(startOfToday.getTime() + 2 * 24 * 60 * 60 * 1000)

    // Obtener todas las estadísticas en paralelo
    const [
      totalAppointments,
      upcomingAppointments,
      monthlyAppointments,
      monthlyRevenue,
      newCustomersThisMonth,
      completedAppointments,
      cancelledAppointments
    ] = await Promise.all([
      // Total de citas
      prisma.appointment.count({
        where: { businessId: business.id }
      }),

      // Citas próximas (hoy y mañana)
      prisma.appointment.count({
        where: {
          businessId: business.id,
          appointmentDate: {
            gte: startOfToday,
            lt: endOfTomorrow
          },
          status: { in: ['pending', 'confirmed'] }
        }
      }),

      // Citas del mes
      prisma.appointment.findMany({
        where: {
          businessId: business.id,
          appointmentDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        include: {
          service: true
        }
      }),

      // Ingresos del mes (suma de precios de servicios completados)
      prisma.appointment.findMany({
        where: {
          businessId: business.id,
          appointmentDate: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          status: 'completed'
        },
        include: {
          service: true
        }
      }),

      // Nuevos clientes este mes (clientes únicos)
      prisma.appointment.groupBy({
        by: ['customerPhone'],
        where: {
          businessId: business.id,
          appointmentDate: {
            gte: startOfMonth
          }
        }
      }),

      // Citas completadas
      prisma.appointment.count({
        where: {
          businessId: business.id,
          status: 'completed'
        }
      }),

      // Citas canceladas
      prisma.appointment.count({
        where: {
          businessId: business.id,
          status: 'cancelled'
        }
      })
    ])

    // Calcular ingresos mensuales
    const monthlyRevenueTotal = monthlyRevenue.reduce((total, appointment) => {
      return total + (appointment.service?.price || 0)
    }, 0)

    // Calcular tasa de cancelación
    const totalProcessedAppointments = completedAppointments + cancelledAppointments
    const cancellationRate = totalProcessedAppointments > 0 
      ? Math.round((cancelledAppointments / totalProcessedAppointments) * 100)
      : 0

    const stats = {
      totalAppointments,
      upcomingAppointments,
      monthlyRevenue: monthlyRevenueTotal,
      newCustomers: newCustomersThisMonth.length,
      completedAppointments,
      cancellationRate
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}