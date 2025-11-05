// app/[business]/booking/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Phone, Star, User, Calendar as CalendarIcon } from 'lucide-react'

// Datos mock del negocio (luego vendrán de la base de datos)
const mockBusiness = {
  id: '1',
  name: 'Barbería El Corte',
  description: 'Barbería tradicional con los mejores cortes y afeitados clásicos',
  address: 'Av. Principal 123, Santiago',
  phone: '+56912345678',
  rating: 4.8,
  reviewCount: 124,
  image: '/barberia.jpg'
}

const mockServices = [
  {
    id: '1',
    name: 'Corte de Cabello',
    description: 'Corte moderno y personalizado',
    duration: 30,
    price: 15000,
    category: 'Cortes'
  },
  {
    id: '2',
    name: 'Arreglo de Barba',
    description: 'Afeitado y diseño de barba',
    duration: 20,
    price: 8000,
    category: 'Barba'
  },
  {
    id: '3',
    name: 'Corte + Barba',
    description: 'Combo completo de corte y arreglo de barba',
    duration: 45,
    price: 20000,
    category: 'Combos'
  }
]

const availableTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
]

export default function BookingPage() {
  const params = useParams()
  const businessSlug = params.business as string

  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [currentStep, setCurrentStep] = useState(1)

  // Filtrar fechas disponibles (no fines de semana y no fechas pasadas)
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 || date.getDay() === 6
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Reserva enviada:', {
      business: businessSlug,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo
    })
    // Aquí irá la lógica para crear la reserva
    alert('¡Reserva creada exitosamente! Te hemos enviado un correo de confirmación.')
  }

  const selectedServiceData = mockServices.find(service => service.id === selectedService)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header del Negocio */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{mockBusiness.name}</h1>
              <p className="text-slate-600 mt-2">{mockBusiness.description}</p>
              
              <div className="flex items-center space-x-4 mt-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{mockBusiness.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{mockBusiness.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{mockBusiness.rating} ({mockBusiness.reviewCount} reseñas)</span>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              AgendaGo
            </Badge>
          </div>
        </div>
      </div>

      {/* Proceso de Booking */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Booking */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  {[1, 2, 3].map(step => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === currentStep 
                          ? 'bg-slate-900 text-white' 
                          : step < currentStep 
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-2 ${
                          step < currentStep ? 'bg-green-500' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <CardTitle>
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
                      {mockServices.map(service => (
                        <div
                          key={service.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedService === service.id
                              ? 'border-slate-900 bg-slate-50'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                          onClick={() => setSelectedService(service.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{service.name}</h3>
                              <p className="text-slate-600 text-sm mt-1">{service.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{service.duration} min</span>
                                </div>
                                <Badge variant="outline">{service.category}</Badge>
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
                        />
                      </div>

                      <div>
                        <Label className="text-lg font-semibold">Selecciona una Hora</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {availableTimeSlots.map(time => (
                            <Button
                              key={time}
                              type="button"
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="h-12"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
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
                          disabled={!selectedDate || !selectedTime}
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
                          disabled={!customerInfo.name || !customerInfo.phone}
                        >
                          Confirmar Reserva
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
                {selectedServiceData && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Servicio:</span>
                        <span>{selectedServiceData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Duración:</span>
                        <span>{selectedServiceData.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Precio:</span>
                        <span>{formatPrice(selectedServiceData.price)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      {selectedDate && (
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">Fecha:</span>
                          <span>{selectedDate.toLocaleDateString('es-CL')}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between">
                          <span className="font-semibold">Hora:</span>
                          <span>{selectedTime}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatPrice(selectedServiceData.price)}</span>
                      </div>
                    </div>
                  </>
                )}

                {!selectedServiceData && (
                  <p className="text-slate-500 text-center py-8">
                    Selecciona un servicio para ver el resumen
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}