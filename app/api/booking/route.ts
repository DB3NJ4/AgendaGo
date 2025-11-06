// app/api/booking/route.ts - VERSIÓN CORREGIDA
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AppointmentScheduler } from '@/lib/scheduler'
import { z } from 'zod'

const bookingSchema = z.object({
  businessId: z.string().min(1, 'Business ID es requerido'),
  serviceId: z.string().min(1, 'Service ID es requerido'),
  appointmentDate: z.union([
    z.string().min(1, 'Fecha es requerida'),
    z.date()
  ]).transform(val => new Date(val)),
  customerName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  customerPhone: z.string().min(6, 'Teléfono inválido'),
  customerEmail: z.string().email('Email inválido').optional().or(z.literal('')).or(z.null()).default('')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📝 Datos recibidos para booking:', {
      businessId: body.businessId,
      serviceId: body.serviceId,
      appointmentDate: body.appointmentDate,
      appointmentDateType: typeof body.appointmentDate,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail
    })

    const validationResult = bookingSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('❌ Error de validación Zod:', validationResult.error.errors)
      return NextResponse.json({ 
        error: 'Datos de entrada inválidos',
        details: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }

    const { 
      businessId, 
      serviceId, 
      appointmentDate, 
      customerName, 
      customerPhone, 
      customerEmail 
    } = validationResult.data

    console.log('✅ Datos validados:', {
      businessId,
      serviceId,
      appointmentDate,
      customerName,
      customerPhone,
      customerEmail
    })

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        isActive: true
      }
    })

    if (!business) {
      console.log('❌ Negocio no encontrado:', businessId)
      return NextResponse.json({ 
        error: 'Negocio no encontrado o inactivo' 
      }, { status: 404 })
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId: businessId,
        isActive: true
      }
    })

    if (!service) {
      console.log('❌ Servicio no encontrado:', { serviceId, businessId })
      return NextResponse.json({ 
        error: 'Servicio no encontrado' 
      }, { status: 404 })
    }

    console.log('✅ Servicio encontrado:', service.name)
    
    if (appointmentDate < new Date()) {
      console.log('❌ Cita en el pasado:', appointmentDate)
      return NextResponse.json({ 
        error: 'No se pueden agendar citas en fechas pasadas' 
      }, { status: 400 })
    }

    console.log('🔍 Verificando disponibilidad...')

    const result = await prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          businessId,
          appointmentDate: {
            gte: new Date(appointmentDate.getTime() - 30 * 60000),
            lte: new Date(appointmentDate.getTime() + service.duration * 60000)
          },
          status: { in: ['pending', 'confirmed'] }
        }
      })

      if (conflict) {
        console.log('❌ Conflicto de horario encontrado:', conflict.id)
        return { type: 'conflict', data: conflict }
      }

      // VERSIÓN CORREGIDA - sin el campo timezone que no existe
      const appointment = await tx.appointment.create({
        data: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || null,
          appointmentDate: appointmentDate,
          duration: service.duration,
          status: 'pending',
          businessId,
          serviceId
        },
        include: {
          service: true,
          business: {
            select: {
              name: true,
              phone: true,
              email: true,
              address: true  // SOLO campos que existen
            }
          }
        }
      })

      console.log('✅ Cita creada:', appointment.id)
      return { type: 'appointment', data: appointment }
    })

    if (result.type === 'conflict') {
      return NextResponse.json({ 
        error: 'Lo sentimos, ese horario ya no está disponible. Por favor elige otro.' 
      }, { status: 409 })
    }

    const appointment = result.data

    try {
      console.log('📧 Enviando email de confirmación...')
      await AppointmentScheduler.sendConfirmationEmail(appointment.id)
      console.log('✅ Email de confirmación enviado')
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError)
    }

    console.log('🎉 Reserva completada exitosamente')

    return NextResponse.json({ 
      success: true, 
      appointment: {
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        customerName: appointment.customerName,
        service: appointment.service.name,
        business: appointment.business.name
      },
      message: 'Reserva creada exitosamente. Te hemos enviado un email de confirmación.'
    }, { status: 201 })

  } catch (error) {
    console.error('💥 Error creating booking:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        return NextResponse.json({ 
          error: 'Ya existe una reserva con estos datos' 
        }, { status: 400 })
      }
      if (error.message.includes('P2025')) {
        return NextResponse.json({ 
          error: 'Referencia no encontrada en la base de datos' 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}