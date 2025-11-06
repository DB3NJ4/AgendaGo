// app/api/appointments/[id]/cancel/route.ts - VERSIÓN TEMPORAL
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AppointmentScheduler } from '@/lib/scheduler'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  let appointmentId: string | null = null
  
  try {
    const { id } = await params
    appointmentId = id
    
    console.log('🔄 INICIANDO CANCELACIÓN para cita:', id)

    if (!id || id.length < 10) {
      console.log('❌ ID inválido:', id)
      return NextResponse.json(
        { error: 'ID de cita inválido' },
        { status: 400 }
      )
    }

    console.log('🔍 Buscando cita en la base de datos...')
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      console.log('❌ Cita no encontrada:', id)
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    console.log('✅ Cita encontrada:', {
      id: appointment.id,
      customerName: appointment.customerName,
      status: appointment.status
    })

    if (appointment.status === 'cancelled') {
      console.log('ℹ️ Cita ya estaba cancelada')
      return NextResponse.json(
        { error: 'La cita ya estaba cancelada' },
        { status: 400 }
      )
    }

    console.log('📝 Actualizando cita a estado "cancelled"...')
    // VERSIÓN TEMPORAL - solo actualizar status sin cancelledAt
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { 
        status: 'cancelled'
        // cancelledAt: new Date() // ← REMOVIDO TEMPORALMENTE
      }
    })

    console.log('✅ Cita actualizada exitosamente')

    // Enviar email de cancelación
    try {
      console.log('📧 Iniciando envío de email de cancelación...')
      await AppointmentScheduler.sendCancellationEmail(id)
      console.log('✅ Email de cancelación enviado')
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError)
    }

    console.log('🎉 Cancelación completada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Cita cancelada exitosamente',
      appointment: {
        id: updatedAppointment.id,
        status: updatedAppointment.status
      }
    })

  } catch (error) {
    console.error('💥 ERROR CRÍTICO en cancelación:', {
      appointmentId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
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