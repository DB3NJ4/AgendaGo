// app/api/appointments/route.ts
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
      include: {
        businesses: {
          include: {
            appointments: {
              include: {
                service: true
              },
              orderBy: { appointmentDate: 'asc' }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ appointments: [] })
    }

    const business = user.businesses[0]
    
    // Filtrar citas futuras o del día actual
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const upcomingAppointments = business.appointments.filter(apt => 
      new Date(apt.appointmentDate) >= todayStart
    )

    return NextResponse.json({ appointments: upcomingAppointments })

  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      serviceId, 
      appointmentDate, 
      notes 
    } = body

    // Validaciones
    if (!customerName || !customerPhone || !serviceId || !appointmentDate) {
      return NextResponse.json({ 
        error: 'Nombre, teléfono, servicio y fecha son requeridos' 
      }, { status: 400 })
    }

    // Buscar el negocio del usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { 
        businesses: {
          include: {
            services: {
              where: { id: serviceId }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ error: 'No se encontró un negocio' }, { status: 404 })
    }

    const business = user.businesses[0]
    
    if (business.services.length === 0) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    const service = business.services[0]
    const appointmentDateTime = new Date(appointmentDate)

    // Verificar que no haya conflicto de horarios
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        businessId: business.id,
        appointmentDate: {
          gte: new Date(appointmentDateTime.getTime() - 30 * 60000), // 30 min antes
          lte: new Date(appointmentDateTime.getTime() + service.duration * 60000) // duración después
        },
        status: { in: ['pending', 'confirmed'] }
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json({ 
        error: 'Ya existe una cita en ese horario' 
      }, { status: 400 })
    }

    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        appointmentDate: appointmentDateTime,
        duration: service.duration,
        notes: notes || null,
        status: 'pending',
        businessId: business.id,
        serviceId: service.id
      },
      include: {
        service: true
      }
    })

    return NextResponse.json({ appointment })

  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}