// app/api/cron/reminders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AppointmentScheduler } from '@/lib/scheduler'

export async function POST(request: NextRequest) {
  try {
    // En producción, esto debería estar protegido o ejecutarse via cron job real
    if (process.env.NODE_ENV === 'production' && request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const result = await AppointmentScheduler.send24HourReminders()
    
    return NextResponse.json({ 
      success: true, 
      message: `Recordatorios enviados: ${result.sent}` 
    })

  } catch (error) {
    console.error('Error ejecutando recordatorios:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}