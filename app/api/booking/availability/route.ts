// app/api/booking/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, serviceId, date } = body

    if (!businessId || !serviceId || !date) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Obtener el servicio para saber su duración
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Obtener citas existentes para esa fecha
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        businessId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['pending', 'confirmed'] }
      },
      include: {
        service: true
      }
    })

    // Obtener horarios del negocio
    const businessHours = await prisma.businessHours.findMany({
      where: { businessId }
    })

    const dayOfWeek = selectedDate.getDay()
    const todayHours = businessHours.find(bh => bh.dayOfWeek === dayOfWeek)

    if (!todayHours || todayHours.isClosed) {
      return NextResponse.json({ availableSlots: [] })
    }

    // Generar todos los slots posibles del día
    const allSlots = generateTimeSlots(todayHours.openTime!, todayHours.closeTime!)
    
    // Verificar disponibilidad para cada slot
    const availableSlots = allSlots.map(slot => {
      const slotDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${slot}`)
      const slotEndTime = new Date(slotDateTime.getTime() + service.duration * 60000)

      // Verificar si hay conflicto con citas existentes
      const hasConflict = existingAppointments.some(apt => {
        const aptStart = new Date(apt.appointmentDate)
        const aptEnd = new Date(aptStart.getTime() + apt.service.duration * 60000)
        
        return (slotDateTime < aptEnd && slotEndTime > aptStart)
      })

      return {
        time: slot,
        available: !hasConflict
      }
    })

    return NextResponse.json({ availableSlots })

  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = []
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  let currentHour = startHour
  let currentMinute = startMinute

  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    slots.push(timeString)
    
    currentMinute += 30
    if (currentMinute >= 60) {
      currentHour++
      currentMinute = 0
    }
  }

  return slots
}