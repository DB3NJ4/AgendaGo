// lib/scheduler.ts
import { prisma } from '@/lib/prisma'
import { EmailService } from './email-service'

export class AppointmentScheduler {
  // Enviar recordatorios 24 horas antes
  static async send24HourReminders() {
    try {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      // Buscar citas para mañana
      const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0))
      const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999))

      console.log('🔔 Buscando citas para recordatorio (mañana):', startOfDay, endOfDay)

      const appointments = await prisma.appointment.findMany({
        where: {
          appointmentDate: {
            gte: startOfDay,
            lte: endOfDay
          },
          status: { in: ['pending', 'confirmed'] },
          reminderSentAt: null
        },
        include: {
          service: true,
          business: {
            select: {
              name: true,
              phone: true,
              address: true,
              slug: true
            }
          }
        }
      })

      console.log(`📧 Enviando ${appointments.length} recordatorios`)

      for (const appointment of appointments) {
        try {
          if (appointment.customerEmail) {
            await EmailService.sendAppointmentReminder({
              to: appointment.customerEmail,
              customerName: appointment.customerName,
              businessName: appointment.business.name,
              serviceName: appointment.service.name,
              appointmentDate: appointment.appointmentDate.toLocaleDateString('es-CL'),
              appointmentTime: appointment.appointmentDate.toLocaleTimeString('es-CL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              businessPhone: appointment.business.phone || '',
              businessAddress: appointment.business.address || undefined,
              confirmLink: `${process.env.NEXT_PUBLIC_APP_URL}/api/appointments/${appointment.id}/confirm`,
              cancelLink: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel/${appointment.id}` // ← CORREGIDO
            })

            // Marcar como recordatorio enviado
            await prisma.appointment.update({
              where: { id: appointment.id },
              data: { reminderSentAt: new Date() }
            })

            console.log(`✅ Recordatorio enviado para: ${appointment.customerName}`)
          }
        } catch (error) {
          console.error(`❌ Error enviando recordatorio para ${appointment.customerName}:`, error)
        }
      }

      return { sent: appointments.length }
    } catch (error) {
      console.error('❌ Error en send24HourReminders:', error)
      throw error
    }
  }

  // Enviar confirmaciones inmediatas después de crear cita
  static async sendConfirmationEmail(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          service: true,
          business: {
            select: {
              name: true,
              phone: true,
              address: true,
              slug: true
            }
          }
        }
      })

      if (!appointment) {
        console.log('❌ Cita no encontrada:', appointmentId)
        return
      }

      if (!appointment.customerEmail) {
        console.log('❌ No se puede enviar confirmación: cliente sin email')
        return
      }

      console.log('📧 Enviando confirmación a:', appointment.customerEmail)

      await EmailService.sendAppointmentConfirmation({
        to: appointment.customerEmail,
        customerName: appointment.customerName,
        businessName: appointment.business.name,
        serviceName: appointment.service.name,
        appointmentDate: appointment.appointmentDate.toLocaleDateString('es-CL'),
        appointmentTime: appointment.appointmentDate.toLocaleTimeString('es-CL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: appointment.duration,
        businessPhone: appointment.business.phone || '',
        businessAddress: appointment.business.address || undefined,
        cancelLink: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel/${appointment.id}` // ← CORREGIDO
      })

      console.log(`✅ Confirmación enviada para: ${appointment.customerName}`)

    } catch (error) {
      console.error('❌ Error enviando confirmación:', error)
      // No lanzar error para no afectar la creación de la cita
    }
  }

  // Enviar email de cancelación
  static async sendCancellationEmail(appointmentId: string) {
    try {
      console.log('🔄 Iniciando envío de cancelación para:', appointmentId)
      
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          service: true,
          business: {
            select: {
              name: true,
              phone: true,
              slug: true
            }
          }
        }
      })

      if (!appointment) {
        console.log('❌ Cita no encontrada para cancelación:', appointmentId)
        return
      }

      if (!appointment.customerEmail) {
        console.log('❌ Cliente sin email para cancelación:', appointment.customerName)
        return
      }

      console.log('📧 Enviando cancelación a:', appointment.customerEmail)

      await EmailService.sendAppointmentCancellation({
        to: appointment.customerEmail,
        customerName: appointment.customerName,
        businessName: appointment.business.name,
        serviceName: appointment.service.name,
        appointmentDate: appointment.appointmentDate.toLocaleDateString('es-CL'),
        appointmentTime: appointment.appointmentDate.toLocaleTimeString('es-CL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        businessPhone: appointment.business.phone || '',
        rescheduleLink: `${process.env.NEXT_PUBLIC_APP_URL}/booking/${appointment.business.slug}`
      })

      console.log('✅ Cancelación enviada exitosamente')

    } catch (error) {
      console.error('❌ Error en sendCancellationEmail:', error)
      // No lanzar error para no afectar la cancelación
    }
  }
}