// app/booking/cancel-too-late/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function CancelTooLatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">No se puede cancelar</CardTitle>
          <CardDescription>
            El plazo para cancelar ha expirado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Las cancelaciones deben hacerse con al menos 2 horas de anticipación.
          </p>
          <p className="text-sm text-gray-500">
            Por favor contáctanos directamente por teléfono si necesitas ayuda.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}