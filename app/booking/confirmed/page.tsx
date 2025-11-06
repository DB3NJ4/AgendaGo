// app/booking/confirmed/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Confirmación Exitosa!</CardTitle>
          <CardDescription>
            Has confirmado tu asistencia a la cita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Tu confirmación ha sido registrada. Te esperamos en tu cita.
          </p>
          <p className="text-sm text-gray-500">
            Recibirás un recordatorio 24 horas antes de tu cita.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}