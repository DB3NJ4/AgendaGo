import { prisma } from '@/lib/db'

export async function getBusinessStats(businessId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [
    totalAppointments,
    upcomingAppointments,
    monthlyRevenue,
    newCustomers
  ] = await Promise.all([
    // Total de citas
    prisma.appointment.count({
      where: { businessId }
    }),

    // Citas próximas (hoy y mañana)
    prisma.appointment.count({
      where: {
        businessId,
        appointmentDate: {
          gte: new Date(),
          lt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 días
        },
        status: 'confirmed'
      }
    }),

    // Ingresos del mes
    prisma.appointment.aggregate({
      where: {
        businessId,
        appointmentDate: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        status: { in: ['confirmed', 'completed'] }
      },
      _sum: {
        service: {
          price: true
        }
      }
    }),

    // Nuevos clientes este mes
    prisma.appointment.groupBy({
      by: ['customerPhone'],
      where: {
        businessId,
        createdAt: {
          gte: startOfMonth
        }
      },
      _count: {
        customerPhone: true
      }
    })
  ])

  return {
    totalAppointments,
    upcomingAppointments,
    monthlyRevenue: monthlyRevenue._sum.service?.price || 0,
    newCustomers: newCustomers.length
  }
}