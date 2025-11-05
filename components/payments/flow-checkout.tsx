'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FlowCheckoutProps {
  priceId: string
  planName: string
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

export function FlowCheckout({ priceId, planName, amount, onSuccess, onError }: FlowCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      // Simular integración con Flow.cl
      console.log('Iniciando pago con Flow.cl:', { priceId, planName, amount })
      
      // En producción, aquí iría:
      // 1. Crear orden en tu backend
      // 2. Redirigir a Flow.cl
      // 3. Manejar callback de éxito/error
      
      setTimeout(() => {
        onSuccess()
        setIsLoading(false)
      }, 2000)
      
    } catch (error) {
      onError('Error al procesar el pago')
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completar Suscripción</CardTitle>
        <CardDescription>
          Serás redirigido a Flow.cl para completar el pago de forma segura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{planName}</p>
              <p className="text-sm text-slate-600">Suscripción mensual</p>
            </div>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP'
              }).format(amount)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p>✅ Pago seguro con Flow.cl</p>
          <p>✅ Factura electrónica incluida</p>
          <p>✅ Cancelación en cualquier momento</p>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Procesando...' : 'Pagar con Tarjeta o Transferencia'}
        </Button>
        
        <p className="text-xs text-center text-slate-500">
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
        </p>
      </CardContent>
    </Card>
  )
}