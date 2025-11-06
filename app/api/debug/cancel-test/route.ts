// app/api/debug/cancel-test/route.ts
import { EmailService } from '@/lib/email-service'

export async function GET() {
  try {
    console.log('🚀 Probando email de cancelación...')
    
    const result = await EmailService.sendAppointmentCancellation({
      to: 'benjalop24@gmail.com', // Tu email
      customerName: 'Benjamin Miranda',
      businessName: 'Salón Belleza VIP', 
      serviceName: 'Corte Premium',
      appointmentDate: '25 de Diciembre, 2024',
      appointmentTime: '14:00',
      businessPhone: '+56 9 8765 4321',
      rescheduleLink: 'http://localhost:3000/booking/salon-belleza-vip'
    })

    console.log('✅ Resultado cancelación:', result)

    return Response.json({
      success: true,
      message: 'Email de cancelación enviado - Revisa tu bandeja!',
      result
    })

  } catch (error) {
    console.error('❌ Error en cancelación:', error)
    return Response.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}