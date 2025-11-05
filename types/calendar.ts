// types/calendar.ts
export interface Appointment {
  id: string
  businessId: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  serviceId: string
  serviceName: string
  appointmentDate: Date
  duration: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource?: any
}