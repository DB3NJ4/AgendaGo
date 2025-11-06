// app/booking/cancel/[appointmentId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function CancelPage() {
  const params = useParams()
  const appointmentId = params.appointmentId as string
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cancelAppointment = async () => {
      try {
        console.log('🔄 Cancelando cita:', appointmentId)
        
        const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          setSuccess(true)
          console.log('✅ Cita cancelada exitosamente')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Error cancelando la cita')
          console.error('❌ Error cancelando:', errorData)
        }
      } catch (error) {
        setError('Error de conexión')
        console.error('💥 Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (appointmentId) {
      cancelAppointment()
    }
  }, [appointmentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cancelando tu cita...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cancelar</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cita Cancelada</h1>
          <p className="text-gray-600 mb-4">Tu cita ha sido cancelada exitosamente.</p>
          <p className="text-gray-500 text-sm mb-6">
            Te hemos enviado un email de confirmación de la cancelación.
          </p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return null
}