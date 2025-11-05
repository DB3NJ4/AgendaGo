'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Phone, Mail, Clock, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceName: string
  appointmentDate: Date
  duration: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'Juan Pérez',
    customerPhone: '+56912345678',
    customerEmail: 'juan@email.com',
    serviceName: 'Corte de pelo',
    appointmentDate: new Date(2024, 10, 15, 10, 0),
    duration: 30,
    status: 'confirmed',
    notes: 'Cliente preferente'
  },
  {
    id: '2',
    customerName: 'María González',
    customerPhone: '+56987654321',
    serviceName: 'Arreglo de barba',
    appointmentDate: new Date(2024, 10, 15, 14, 0),
    duration: 20,
    status: 'confirmed'
  },
  {
    id: '3',
    customerName: 'Carlos López',
    customerPhone: '+56955556666',
    serviceName: 'Corte y barba',
    appointmentDate: new Date(2024, 10, 16, 11, 0),
    duration: 45,
    status: 'pending'
  }
]

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)

  const getStatusVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'pending': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'completed': return 'outline'
      default: return 'default'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Citas</CardTitle>
        <CardDescription>
          Gestiona las citas de los próximos días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-slate-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">{appointment.customerName}</h3>
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {appointment.status === 'confirmed' ? 'Confirmada' : 
                       appointment.status === 'pending' ? 'Pendiente' :
                       appointment.status === 'cancelled' ? 'Cancelada' : 'Completada'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-1">{appointment.serviceName}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Duración: {appointment.duration} min</span>
                    </div>
                    {appointment.customerEmail && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{appointment.customerEmail}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.customerPhone}</span>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-slate-500 mt-1 italic">Nota: {appointment.notes}</p>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'confirmed')}>
                    Marcar como Confirmada
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'completed')}>
                    Marcar como Completada
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'cancelled')}>
                    Cancelar Cita
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}