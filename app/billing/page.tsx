'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Star, Zap } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    description: 'Perfecto para empezar',
    price: 5000,
    priceId: 'price_basic_monthly',
    interval: 'mes',
    features: [
      '1 negocio',
      '50 citas/mes',
      'Servicios ilimitados',
      'Recordatorios por email',
      'Soporte por email',
      'Página web básica'
    ],
    popular: false,
    current: true
  },
  {
    id: 'professional',
    name: 'Profesional',
    description: 'Para negocios en crecimiento',
    price: 15000,
    priceId: 'price_professional_monthly',
    interval: 'mes',
    features: [
      '1 negocio',
      'Citas ilimitadas',
      'Servicios ilimitados',
      'Recordatorios email + SMS',
      'Soporte prioritario',
      'Página web avanzada',
      'Reportes básicos',
      'Integración WhatsApp'
    ],
    popular: true,
    current: false
  },
  {
    id: 'enterprise',
    name: 'Empresa',
    description: 'Para múltiples ubicaciones',
    price: 30000,
    priceId: 'price_enterprise_monthly',
    interval: 'mes',
    features: [
      '3 negocios',
      'Citas ilimitadas',
      'Servicios ilimitados',
      'Recordatorios email + SMS + WhatsApp',
      'Soporte 24/7',
      'Página web premium',
      'Reportes avanzados',
      'API acceso',
      'White-label',
      'Estadísticas detalladas'
    ],
    popular: false,
    current: false
  }
]

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('professional')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true)
    
    // Simular proceso de pago
    console.log('Iniciando suscripción al plan:', planId)
    
    // Aquí irá la integración con Flow.cl o Stripe
    setTimeout(() => {
      alert('Redirigiendo a pasarela de pago...')
      setIsLoading(false)
    }, 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planes y Precios</h1>
          <p className="text-slate-600 mt-2">
            Elige el plan que mejor se adapte a tu negocio
          </p>
        </div>
        
        <Badge variant="outline" className="text-sm">
          Plan Actual: Básico
        </Badge>
      </div>

      {/* Planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative transition-all hover:scale-105 ${
              plan.popular 
                ? 'border-2 border-blue-500 shadow-lg' 
                : plan.current
                  ? 'border-2 border-green-500'
                  : 'border-slate-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1">
                  <Check className="w-3 h-3 mr-1" />
                  Plan Actual
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                {plan.id === 'enterprise' && <Crown className="w-5 h-5 text-yellow-500" />}
                {plan.id === 'professional' && <Zap className="w-5 h-5 text-blue-500" />}
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="mt-4">
                <div className="text-4xl font-bold">
                  {formatPrice(plan.price)}
                </div>
                <div className="text-slate-500 text-sm">por {plan.interval}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full"
                variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.current || isLoading}
              >
                {plan.current ? 'Plan Actual' : 'Seleccionar Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Información de Pagos */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Información de Facturación</CardTitle>
          <CardDescription>
            Gestiona tu suscripción y métodos de pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Plan Actual</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">Básico</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio:</span>
                  <span className="font-medium">$5.000/mes</span>
                </div>
                <div className="flex justify-between">
                  <span>Próxima factura:</span>
                  <span className="font-medium">15 Dic 2024</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Método de Pago</h3>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">FL</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Tarjeta de Crédito</p>
                  <p className="text-xs text-slate-500">**** 4242</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Cambiar Método
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Pagos */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Tus transacciones y facturas recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 'inv_001', date: '15 Nov 2024', amount: 5000, status: 'Pagado' },
              { id: 'inv_002', date: '15 Oct 2024', amount: 5000, status: 'Pagado' },
              { id: 'inv_003', date: '15 Sep 2024', amount: 5000, status: 'Pagado' }
            ].map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Factura #{invoice.id}</p>
                  <p className="text-sm text-slate-500">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(invoice.amount)}</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Descargar Todos los Comprobantes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}