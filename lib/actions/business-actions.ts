// lib/actions/business-actions.ts
import { prisma } from '@/lib/prisma'

export async function getBusinessStats(businessId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)

  const [
    totalAppointments,
    upcomingAppointments,
    monthlyAppointments,
    newCustomersThisMonth
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
          gte: startOfDay,
          lt: endOfDay
        },
        status: { in: ['pending', 'confirmed'] }
      }
    }),
    
    // Citas del mes completadas
    prisma.appointment.findMany({
      where: {
        businessId,
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
        businessId,
        appointmentDate: {
          gte: startOfMonth
        }
      },
      _count: {
        customerPhone: true
      }
    })
  ])

  // Calcular ingresos mensuales
  const monthlyRevenue = monthlyAppointments.reduce((total, appointment) => {
    return total + (appointment.service?.price || 0)
  }, 0)

  return {
    totalAppointments,
    upcomingAppointments,
    monthlyRevenue,
    newCustomers: newCustomersThisMonth.length
  }
}

export async function getUpcomingAppointments(businessId: string) {
  const now = new Date()
  const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)

  const appointments = await prisma.appointment.findMany({
    where: {
      businessId,
      appointmentDate: {
        gte: now,
        lt: endOfTomorrow
      },
      status: { in: ['pending', 'confirmed'] }
    },
    include: {
      service: true
    },
    orderBy: {
      appointmentDate: 'asc'
    },
    take: 5
  })

  return appointments.map(appointment => ({
    id: appointment.id,
    customer: appointment.customerName,
    service: appointment.service.name,
    time: formatAppointmentTime(appointment.appointmentDate),
    date: appointment.appointmentDate
  }))
}

function formatAppointmentTime(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const appointmentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const diffTime = appointmentDay.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const timeString = date.toLocaleTimeString('es-CL', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })

  if (diffDays === 0) {
    return `Hoy ${timeString}`
  } else if (diffDays === 1) {
    return `Mañana ${timeString}`
  } else {
    return `${date.toLocaleDateString('es-CL')} ${timeString}`
  }
}