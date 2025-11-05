// types/index.ts
export interface Business {
  id: string
  name: string
  slug: string
  email: string
  subscription_plan: 'basic' | 'professional' | 'enterprise'
  subscription_status: 'active' | 'canceled' | 'trial'
  created_at: string
}

export interface Service {
  id: string
  businessId: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
  createdAt: Date
}

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
}

export interface BusinessHours {
  id: string
  businessId: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}// types/index.ts
export interface Business {
  id: string
  name: string
  slug: string
  email: string
  subscription_plan: 'basic' | 'professional' | 'enterprise'
  subscription_status: 'active' | 'canceled' | 'trial'
  created_at: string
}

export interface Service {
  id: string
  businessId: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
  createdAt: Date
}

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
}

export interface BusinessHours {
  id: string
  businessId: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}