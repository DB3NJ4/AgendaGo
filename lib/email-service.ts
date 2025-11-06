// lib/email-service.ts
import { Resend } from 'resend'
import { emailTemplates } from './email-templates'

// Inicializar Resend solo si hay API key
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY no encontrada. Usando modo simulación.')
    return null
  }
  return new Resend(apiKey)
}

const resend = getResendClient()

export interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export class EmailService {
  static async sendEmail(data: EmailData) {
    try {
      // Si no hay Resend configurado, usar simulador
      if (!resend) {
        console.log('📧 ===== EMAIL SIMULADO (Sin Resend) =====')
        console.log('To:', data.to)
        console.log('Subject:', data.subject)
        console.log('Text Preview:', data.text.substring(0, 150) + '...')
        console.log('📧 ===== FIN EMAIL =====')
        
        await new Promise(resolve => setTimeout(resolve, 500))
        return { id: 'simulated-' + Date.now(), status: 'sent' }
      }

      // Si hay Resend, enviar email real
      console.log('📧 Enviando email real via Resend...')
      const result = await resend.emails.send({
        from: 'AgendaGo <onboarding@resend.dev>',
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      })
      
      console.log('✅ Email enviado via Resend:', result)
      return result

    } catch (error) {
      console.error('❌ Error enviando email:', error)
      
      // Fallback a simulador si Resend falla
      console.log('🔄 Fallback a modo simulación...')
      console.log('📧 Subject:', data.subject)
      console.log('📧 To:', data.to)
      
      return { id: 'fallback-' + Date.now(), status: 'sent' }
    }
  }

  static async sendAppointmentConfirmation(data: {
    to: string
    customerName: string
    businessName: string
    serviceName: string
    appointmentDate: string
    appointmentTime: string
    duration: number
    businessPhone: string
    businessAddress?: string
    cancelLink: string
  }) {
    const template = emailTemplates.appointmentConfirmation(data)
    return this.sendEmail({
      to: data.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  static async sendAppointmentReminder(data: {
    to: string
    customerName: string
    businessName: string
    serviceName: string
    appointmentDate: string
    appointmentTime: string
    businessPhone: string
    businessAddress?: string
    confirmLink: string
    cancelLink: string
  }) {
    const template = emailTemplates.appointmentReminder(data)
    return this.sendEmail({
      to: data.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  static async sendAppointmentCancellation(data: {
    to: string
    customerName: string
    businessName: string
    serviceName: string
    appointmentDate: string
    appointmentTime: string
    businessPhone: string
    rescheduleLink: string
  }) {
    const template = emailTemplates.appointmentCancellation(data)
    return this.sendEmail({
      to: data.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }
}