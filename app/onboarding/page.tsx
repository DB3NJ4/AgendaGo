// app/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  MapPin, 
  Phone, 
  Globe, 
  ArrowLeft, 
  CheckCircle, 
  Building2,
  User,
  Clock,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessData, setBusinessData] = useState({
    name: '',
    slug: '',
    description: '',
    address: '',
    phone: '',
    category: '',
    email: ''
  })

  const categories = [
    'Barbería & Peluquería',
    'Spa & Belleza',
    'Salud & Wellness',
    'Consultoría',
    'Clases & Talleres',
    'Servicios Técnicos',
    'Reparaciones',
    'Otros'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    console.log('📤 Enviando datos del negocio:', businessData)

    const response = await fetch('/api/business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData),
    })

    console.log('📥 Status de respuesta:', response.status)
    
    const result = await response.json()
    console.log('📥 Respuesta completa:', result)

    if (!response.ok) {
      throw new Error(result.error || `Error ${response.status} creando negocio`)
    }

    if (result.success) {
      console.log('✅ Negocio creado exitosamente!')
      console.log('🏢 Negocio creado:', result.business)
      
      toast.success('¡Negocio creado exitosamente!', {
        description: 'Ahora puedes empezar a recibir citas.'
      })
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
      
    } else {
      throw new Error(result.error || 'Error desconocido creando negocio')
    }
    
  } catch (error) {
    console.error('❌ Error en el formulario:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error creando negocio'
    
    toast.error('Error al crear negocio', {
      description: errorMessage
    })
  } finally {
    setIsLoading(false)
  }
}

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .substring(0, 50) // Limitar longitud
  }

  const isStep1Valid = businessData.name && businessData.slug && businessData.category
  const isStep2Valid = businessData.phone

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Bienvenido a <span className="text-blue-600">AgendaGo</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Configura tu negocio en minutos y empieza a recibir citas en línea
          </p>
        </div>

        <Card className="w-full shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`flex flex-col items-center ${
                    step === stepNumber ? 'text-blue-600' : 
                    step > stepNumber ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                      step === stepNumber 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : step > stepNumber
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {step > stepNumber ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="font-semibold text-lg">{stepNumber}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {stepNumber === 1 && 'Información'}
                      {stepNumber === 2 && 'Contacto'}
                      {stepNumber === 3 && 'Confirmación'}
                    </span>
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-4 ${
                      step > stepNumber ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <CardTitle className="text-3xl">
              {step === 1 && 'Información de tu Negocio'}
              {step === 2 && 'Datos de Contacto'}
              {step === 3 && '¡Listo para Empezar!'}
            </CardTitle>
            <CardDescription className="text-lg">
              {step === 1 && 'Completa la información básica de tu negocio'}
              {step === 2 && 'Agrega tus datos de contacto para que los clientes te encuentren'}
              {step === 3 && 'Revisa la información y crea tu negocio'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <form onSubmit={handleSubmit}>
              {/* Paso 1: Información Básica */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">
                        <Building2 className="inline h-4 w-4 mr-2" />
                        Nombre de tu Negocio *
                      </Label>
                      <Input
                        id="name"
                        value={businessData.name}
                        onChange={(e) => {
                          const name = e.target.value
                          setBusinessData({
                            ...businessData,
                            name,
                            slug: generateSlug(name)
                          })
                        }}
                        placeholder="Ej: Barbería El Corte Profesional"
                        className="h-12 text-lg"
                        required
                      />
                      <p className="text-sm text-slate-500">
                        El nombre oficial de tu negocio
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-base">
                        Categoría *
                      </Label>
                      <select
                        id="category"
                        value={businessData.category}
                        onChange={(e) => setBusinessData({...businessData, category: e.target.value})}
                        className="w-full px-3 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-base">
                      <Globe className="inline h-4 w-4 mr-2" />
                      URL de tu Negocio *
                    </Label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <span className="text-slate-500 text-lg font-medium">agendago.cl/</span>
                      <Input
                        id="slug"
                        value={businessData.slug}
                        onChange={(e) => setBusinessData({...businessData, slug: e.target.value})}
                        placeholder="barberia-el-corte"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-3"
                        required
                      />
                    </div>
                    <p className="text-sm text-slate-500">
                      Esta será la dirección web única de tu negocio
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">
                      Descripción de tu Negocio
                    </Label>
                    <Textarea
                      id="description"
                      value={businessData.description}
                      onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                      placeholder="Describe los servicios que ofreces, tu experiencia, y qué hace especial a tu negocio..."
                      rows={4}
                      className="text-lg resize-none"
                    />
                    <p className="text-sm text-slate-500">
                      Esta descripción aparecerá en tu página pública
                    </p>
                  </div>

                  <Button 
                    type="button"
                    className="w-full h-12 text-lg mt-4"
                    disabled={!isStep1Valid}
                    onClick={() => setStep(2)}
                  >
                    Continuar a Contacto
                  </Button>
                </div>
              )}

              {/* Paso 2: Información de Contacto */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Teléfono de Contacto *
                      </Label>
                      <Input
                        id="phone"
                        value={businessData.phone}
                        onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                        placeholder="+56912345678"
                        className="h-12 text-lg"
                        required
                      />
                      <p className="text-sm text-slate-500">
                        Número donde los clientes pueden contactarte
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">
                        <User className="inline h-4 w-4 mr-2" />
                        Email de Contacto
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessData.email}
                        onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                        placeholder="contacto@minegocio.cl"
                        className="h-12 text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base">
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      value={businessData.address}
                      onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                      placeholder="Av. Principal 123, Comuna, Ciudad"
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-slate-500">
                      Dirección física de tu negocio (opcional)
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 text-lg"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Atrás
                    </Button>
                    <Button 
                      type="button"
                      className="flex-1 h-12 text-lg"
                      disabled={!isStep2Valid}
                      onClick={() => setStep(3)}
                    >
                      Revisar Información
                    </Button>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-900 text-lg">
                          Revisa tu información
                        </h3>
                        <p className="text-green-700">
                          Todo está listo para crear tu negocio en AgendaGo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-slate-900">Información del Negocio</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-500">Nombre</p>
                          <p className="font-medium">{businessData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Categoría</p>
                          <p className="font-medium">{businessData.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Descripción</p>
                          <p className="font-medium">{businessData.description || 'No especificada'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg text-slate-900">Contacto</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-500">Teléfono</p>
                          <p className="font-medium">{businessData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium">{businessData.email || 'No especificado'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Dirección</p>
                          <p className="font-medium">{businessData.address || 'No especificada'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview de la URL */}
                  <div className="p-6 bg-slate-900 text-white rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      Tu Página Web
                    </h4>
                    <p className="font-mono text-xl mb-2 break-all">
                      https://agendago.cl/<span className="font-bold text-blue-300">{businessData.slug}</span>
                    </p>
                    <p className="text-slate-300 text-sm">
                      Los clientes podrán visitar esta dirección para ver tus servicios, horarios y reservar citas 24/7.
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 text-lg"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Editar Información
                    </Button>
                    <Button 
                      type="submit"
                      className="flex-1 h-12 text-lg bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creando Negocio...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Crear Mi Negocio
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-slate-600">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@agendago.cl" className="text-blue-600 hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}