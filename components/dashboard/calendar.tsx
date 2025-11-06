// components/dashboard/calendar.tsx
'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Phone, Calendar as CalendarIcon } from 'lucide-react'

const localizer = momentLocalizer(moment)

// Tipos de eventos
interface AppointmentEvent extends Event {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceName: string
  duration: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
}

export default function AppointmentCalendar() {
  const [events, setEvents] = useState<AppointmentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        const calendarEvents = data.appointments?.map((apt: any) => ({
          id: apt.id,
          title: `${apt.service.name} - ${apt.customerName}`,
          start: new Date(apt.appointmentDate),
          end: new Date(new Date(apt.appointmentDate).getTime() + apt.service.duration * 60000),
          customerName: apt.customerName,
          customerPhone: apt.customerPhone,
          customerEmail: apt.customerEmail,
          serviceName: apt.service.name,
          duration: apt.service.duration,
          status: apt.status,
          notes: apt.notes
        })) || []
        setEvents(calendarEvents)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = '#10b981' // Verde para confirmadas
    let borderColor = '#059669'
    
    switch (event.status) {
      case 'pending':
        backgroundColor = '#f59e0b' // Amarillo para pendientes
        borderColor = '#d97706'
        break
      case 'cancelled':
        backgroundColor = '#ef4444' // Rojo para canceladas
        borderColor = '#dc2626'
        break
      case 'completed':
        backgroundColor = '#6b7280' // Gris para completadas
        borderColor = '#4b5563'
        break
      default:
        backgroundColor = '#10b981'
        borderColor = '#059669'
    }

    return {
      style: {
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        fontWeight: '500',
        fontSize: '12px',
        padding: '2px 4px'
      }
    }
  }

  const handleSelectEvent = (event: AppointmentEvent) => {
    setSelectedEvent(event)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada'
      case 'pending': return 'Pendiente'
      case 'cancelled': return 'Cancelada'
      case 'completed': return 'Completada'
      default: return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'pending': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'completed': return 'outline'
      default: return 'default'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins} min`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando calendario...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calendario de Citas
          </CardTitle>
          <CardDescription>
            Haz clic en cualquier cita para ver los detalles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="week"
              step={30}
              timeslots={2}
              min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
              max={new Date(0, 0, 0, 20, 0, 0)} // 8:00 PM
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
                event: "Cita",
                noEventsInRange: "No hay citas en este período",
                showMore: (total) => `+${total} más`
              }}
              formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Panel de detalles de la cita seleccionada */}
      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Cita</CardTitle>
            <CardDescription>
              Información completa de la cita seleccionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Información del Cliente</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">{selectedEvent.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>{selectedEvent.customerPhone}</span>
                    </div>
                    {selectedEvent.customerEmail && (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500">Email:</span>
                        <span>{selectedEvent.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Detalles del Servicio</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Servicio:</span> {selectedEvent.serviceName}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>Duración: {formatDuration(selectedEvent.duration)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span>{' '}
                      <Badge variant={getStatusVariant(selectedEvent.status)}>
                        {getStatusText(selectedEvent.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Horario</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Fecha:</span>{' '}
                      {moment(selectedEvent.start).format('DD/MM/YYYY')}
                    </div>
                    <div>
                      <span className="font-medium">Hora:</span>{' '}
                      {moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                    </div>
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Notas</h3>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                      {selectedEvent.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Cerrar detalles
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leyenda del calendario */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Leyenda</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Confirmadas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Pendientes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Canceladas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm">Completadas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}