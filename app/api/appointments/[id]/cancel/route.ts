// app/api/appointments/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AppointmentScheduler } from '@/lib/scheduler'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    console.log('🔄 INICIANDO CANCELACIÓN para cita:', id)

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      console.log('❌ Cita no encontrada:', id)
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    }

    console.log('📋 Datos de la cita:', {
      id: appointment.id,
      customerEmail: appointment.customerEmail,
      customerName: appointment.customerName,
      status: appointment.status
    })

    // Verificar que no sea demasiado tarde para cancelar (2 horas antes)
    const appointmentTime = new Date(appointment.appointmentDate)
    const now = new Date()
    const twoHoursBefore = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000)

    if (now > twoHoursBefore) {
      console.log('⏰ Cancelación muy tarde:', {
        now: now.toISOString(),
        appointmentTime: appointmentTime.toISOString(),
        twoHoursBefore: twoHoursBefore.toISOString()
      })
      return new NextResponse(null, {
        status: 302,
        headers: {
          'Location': `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel-too-late`
        }
      })
    }

    console.log('✅ Tiempo OK para cancelar')

    // Actualizar estado a cancelado
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' }
    })

    console.log('📅 Cita actualizada a cancelled')

    // Enviar email de cancelación
    try {
      console.log('📧 Intentando enviar email de cancelación...')
      await AppointmentScheduler.sendCancellationEmail(id)
      console.log('✅ Email de cancelación enviado')
    } catch (emailError) {
      console.error('❌ Error enviando email de cancelación:', emailError)
      // No fallar la cancelación si el email falla
    }

    console.log('🎉 Cancelación completada exitosamente')

    // Redirigir a página de cancelación exitosa
    return new NextResponse(null, {
      status: 302,
      headers: {
        'Location': `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancelled`
      }
    })

  } catch (error) {
    console.error('💥 ERROR en cancelación:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}