// app/api/appointments/[id]/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    }

    // Actualizar estado a confirmado
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'confirmed' }
    })

    // Redirigir a página de éxito
    return new NextResponse(null, {
      status: 302,
      headers: {
        'Location': `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmed`
      }
    })

  } catch (error) {
    console.error('Error confirmando cita:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}