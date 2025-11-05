'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

// Tipos de eventos
interface AppointmentEvent extends Event {
  id: string
  customerName: string
  customerPhone: string
  service: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

const mockAppointments: AppointmentEvent[] = [
  {
    id: '1',
    title: 'Corte de pelo - Juan Pérez',
    start: new Date(2024, 10, 15, 10, 0),
    end: new Date(2024, 10, 15, 10, 30),
    customerName: 'Juan Pérez',
    customerPhone: '+56912345678',
    service: 'Corte de pelo',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Barba - María González',
    start: new Date(2024, 10, 15, 14, 0),
    end: new Date(2024, 10, 15, 14, 20),
    customerName: 'María González',
    customerPhone: '+56987654321',
    service: 'Arreglo de barba',
    status: 'confirmed'
  }
]

export default function AppointmentCalendar() {
  const [events, setEvents] = useState<AppointmentEvent[]>(mockAppointments)

  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = '#3174ad'
    
    if (event.status === 'cancelled') {
      backgroundColor = '#d9534f'
    } else if (event.status === 'pending') {
      backgroundColor = '#f0ad4e'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay citas en este rango"
        }}
      />
    </div>
  )
}