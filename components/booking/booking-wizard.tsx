// components/booking/booking-wizard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Phone, Star, User, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  category: string | null
}

interface BusinessHours {
  dayOfWeek: number
  openTime: string | null
  closeTime: string | null
  isClosed: boolean
}

interface Business {
  id: string
  name: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
}

interface BookingWizardProps {
  business: Business
  services: Service[]
  businessHours: BusinessHours[]
}

interface AvailableSlot {
  time: string
  available: boolean
}

export function BookingWizard({ business, services, businessHours }: BookingWizardProps) {
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const selectedServiceData = services.find(service => service.id === selectedService)

  // Generar horarios disponibles basados en los horarios del negocio
  const generateTimeSlots = () => {
    const slots: string[] = []
    const startHour = 9 // 9:00 AM
    const endHour = 18 // 6:00 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeString)
      }
    }
    return slots
  }

  // Verificar disponibilidad cuando cambia la fecha o el servicio
  useEffect(() => {
    if (selectedDate && selectedService) {
      checkAvailability()
    }
  }, [selectedDate, selectedService])

  const checkAvailability = async () => {
    if (!selectedDate || !selectedService) return

    setLoading(true)
    try {
      const response = await fetch('/api/booking/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: business.id,
          serviceId: selectedService,
          date: selectedDate.toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || [])
      }
    } catch (error) {
      console.error('Error checking availability:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar fechas disponibles
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // No fechas pasadas
    if (date < today) return true
    
    // Verificar horario del negocio para ese día
    const dayOfWeek = date.getDay()
    const businessDay = businessHours.find(bh => bh.dayOfWeek === dayOfWeek)
    
    if (!businessDay || businessDay.isClosed) return true
    
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: business.id,
          serviceId: selectedService,
          appointmentDate: `${selectedDate?.toISOString().split('T')[0]}T${selectedTime}`,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          customerEmail: customerInfo.email
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error creando reserva')
      }

      alert('¡Reserva creada exitosamente! Te hemos enviado un correo de confirmación.')
      // Reset form
      setSelectedService('')
      setSelectedDate(new Date())
      setSelectedTime('')
      setCustomerInfo({ name: '', phone: '', email: '' })
      setCurrentStep(1)
      
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error instanceof Error ? error.message : 'Error creando reserva')
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins} min`
  }

  return (
    <div className="space-y-6">
      {/* Progreso */}
      <div className="flex items-center justify-center space-x-8 mb-6">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center ${
              step === currentStep ? 'text-blue-600' : 
              step < currentStep ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                step === currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : step < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step}
              </div>
              <span className="text-sm font-medium">
                {step === 1 && 'Servicio'}
                {step === 2 && 'Fecha/Hora'}
                {step === 3 && 'Datos'}
              </span>
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-4 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Booking */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && 'Selecciona un Servicio'}
                {currentStep === 2 && 'Elige Fecha y Hora'}
                {currentStep === 3 && 'Tus Datos'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Elige el servicio que necesitas'}
                {currentStep === 2 && 'Selecciona cuando quieres venir'}
                {currentStep === 3 && 'Completa tus datos para confirmar la reserva'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Paso 1: Selección de Servicio */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {services.map(service => (
                      <div
                        key={service.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(service.duration)}</span>
                              </div>
                              {service.category && (
                                <Badge variant="outline">{service.category}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{formatPrice(service.price)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button"
                      className="w-full mt-6"
                      disabled={!selectedService}
                      onClick={() => setCurrentStep(2)}
                    >
                      Continuar
                    </Button>
                  </div>
                )}

                {/* Paso 2: Fecha y Hora */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-lg font-semibold">Selecciona una Fecha</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="rounded-md border mt-2"
                        locale={es}
                      />
                    </div>

                    <div>
                      <Label className="text-lg font-semibold">
                        Selecciona una Hora {loading && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
                      </Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {generateTimeSlots().map(time => {
                          const slot = availableSlots.find(s => s.time === time)
                          const isAvailable = slot ? slot.available : false
                          
                          return (
                            <Button
                              key={time}
                              type="button"
                              variant={selectedTime === time ? "default" : "outline"}
                              disabled={!isAvailable || loading}
                              onClick={() => setSelectedTime(time)}
                              className="h-12"
                            >
                              {time}
                            </Button>
                          )
                        })}
                      </div>
                      {loading && (
                        <p className="text-sm text-gray-500 mt-2">Buscando horarios disponibles...</p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentStep(1)}
                      >
                        Atrás
                      </Button>
                      <Button 
                        type="button"
                        className="flex-1"
                        disabled={!selectedDate || !selectedTime || loading}
                        onClick={() => setCurrentStep(3)}
                      >
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Paso 3: Datos del Cliente */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="+56912345678"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentStep(2)}
                      >
                        Atrás
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1"
                        disabled={!customerInfo.name || !customerInfo.phone || submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Creando Reserva...
                          </>
                        ) : (
                          'Confirmar Reserva'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de la Reserva */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Resumen de tu Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServiceData ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Servicio:</span>
                      <span>{selectedServiceData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Duración:</span>
                      <span>{formatDuration(selectedServiceData.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Precio:</span>
                      <span>{formatPrice(selectedServiceData.price)}</span>
                    </div>
                  </div>

                  {(selectedDate || selectedTime) && (
                    <div className="border-t pt-4">
                      {selectedDate && (
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">Fecha:</span>
                          <span>{format(selectedDate, 'PPP', { locale: es })}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between">
                          <span className="font-semibold">Hora:</span>
                          <span>{selectedTime}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(selectedServiceData.price)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Selecciona un servicio para ver el resumen
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}