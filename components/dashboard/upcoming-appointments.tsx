// components/dashboard/upcoming-appointments.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, Clock, User, Phone, ArrowRight, Plus } from 'lucide-react'

interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  service: {
    name: string
    duration: number
  }
  appointmentDate: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana'
    } else {
      return new Intl.DateTimeFormat('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }).format(date)
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada'
      case 'pending': return 'Pendiente'
      case 'cancelled': return 'Cancelada'
      case 'completed': return 'Completada'
      default: return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Próximas Citas</span>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {appointments.length} cita(s) programada(s) para los próximos días
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-600 mb-2">No hay citas próximas</h3>
            <p className="text-gray-500 text-sm mb-4">
              Cuando tengas citas programadas, aparecerán aquí.
            </p>
            <Button asChild>
              <Link href="/dashboard/appointments/new">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Cita
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{appointment.customerName}</h3>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{appointment.service.name}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{appointment.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/appointments/${appointment.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}

            {appointments.length > 5 && (
              <div className="text-center pt-4">
                <Button asChild variant="outline">
                  <Link href="/dashboard/appointments">
                    Ver todas las citas ({appointments.length})
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}