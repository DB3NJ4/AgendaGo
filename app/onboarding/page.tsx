'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Globe, ArrowLeft, CheckCircle } from 'lucide-react'

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
    category: ''
  })

  const categories = [
    'Barbería & Peluquería',
    'Spa & Belleza',
    'Salud & Wellness',
    'Consultoría',
    'Clases & Talleres',
    'Otros'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const response = await fetch('/api/business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Error creando negocio')
    }

    // Éxito - redirigir al dashboard
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Error:', error)
    alert(error instanceof Error ? error.message : 'Error creando negocio')
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
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === stepNumber 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : step > stepNumber
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                {stepNumber < 2 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? 'Configura tu Negocio' : 'Información de Contacto'}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? 'Completa la información básica de tu negocio' 
              : 'Agrega tus datos de contacto para que los clientes te encuentren'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Paso 1: Información Básica */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de tu Negocio *</Label>
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
                    placeholder="Ej: Barbería El Corte"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    <Globe className="inline h-4 w-4 mr-2" />
                    URL de tu Negocio *
                  </Label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3">
                    <span className="text-slate-500 text-sm">agendago.cl/</span>
                    <Input
                      id="slug"
                      value={businessData.slug}
                      onChange={(e) => setBusinessData({...businessData, slug: e.target.value})}
                      placeholder="barberia-el-corte"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Esta será la dirección web de tu negocio
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <select
                    id="category"
                    value={businessData.category}
                    onChange={(e) => setBusinessData({...businessData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="button"
                  className="w-full mt-6"
                  disabled={!businessData.name || !businessData.slug || !businessData.category}
                  onClick={() => setStep(2)}
                >
                  Continuar a Contacto
                </Button>
              </div>
            )}

            {/* Paso 2: Información de Contacto */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción de tu Negocio</Label>
                  <Textarea
                    id="description"
                    value={businessData.description}
                    onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                    placeholder="Describe tu negocio para que los clientes te conozcan..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    value={businessData.address}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    placeholder="Av. Principal 123, Ciudad"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                    placeholder="+56912345678"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1"
                    disabled={!businessData.phone}
                  >
                    Crear Mi Negocio
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Preview de la URL */}
          {businessData.slug && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg border">
              <p className="text-sm text-slate-600 mb-2">Vista previa de tu página:</p>
              <p className="font-mono text-slate-900 text-lg">
                https://agendago.cl/<span className="font-bold text-slate-900">{businessData.slug}</span>
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Los clientes podrán visitar esta dirección para ver tus servicios y reservar citas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}