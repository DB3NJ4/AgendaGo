// app/dashboard/billing/success/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ArrowLeft, Download } from 'lucide-react'

export default function BillingSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Aquí podrías verificar el estado del pago con tu backend
    console.log('Pago completado exitosamente')
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
          <CardDescription>
            Tu suscripción ha sido activada correctamente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-slate-600">
            <p>✅ Suscripción activada: <strong>Plan Profesional</strong></p>
            <p>✅ Próxima factura: <strong>15 de Diciembre 2024</strong></p>
            <p>✅ Se ha enviado el comprobante a tu email</p>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Descargar Factura
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}