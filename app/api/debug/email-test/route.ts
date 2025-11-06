// app/api/debug/email-test/route.ts
import { EmailService } from '@/lib/email-service'

export async function GET() {
  try {
    console.log('🚀 Iniciando prueba de email REAL...')
    
    // ⚠️ CAMBIA: Usa TU email real (benjalop24@gmail.com)
    const result = await EmailService.sendAppointmentConfirmation({
      to: 'benjalop24@gmail.com', // ← TU EMAIL REAL
      customerName: 'Benjamin Miranda',
      businessName: 'Salón Belleza VIP',
      serviceName: 'Corte Premium',
      appointmentDate: '25 de Diciembre, 2024',
      appointmentTime: '14:00',
      duration: 60,
      businessPhone: '+56 9 8765 4321',
      businessAddress: 'Av. Siempre Viva 123',
      cancelLink: 'http://localhost:3000/api/appointments/test-id/cancel'
    })

    console.log('✅ Resultado del email REAL:', result)

    return Response.json({
      success: true,
      message: 'Email REAL enviado a benjalop24@gmail.com - ¡Revisa tu bandeja!',
      result
    })

  } catch (error) {
    console.error('❌ Error en prueba de email:', error)
    return Response.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}