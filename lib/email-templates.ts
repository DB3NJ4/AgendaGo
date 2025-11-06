// lib/email-templates.ts
export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  appointmentConfirmation: (data: {
    customerName: string
    businessName: string
    serviceName: string
    appointmentDate: string
    appointmentTime: string
    duration: number
    businessPhone: string
    businessAddress?: string
    cancelLink: string
  }): EmailTemplate => ({
    subject: `Confirmación de cita - ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Confirmación de Cita</h1>
            <p>${data.businessName}</p>
          </div>
          <div class="content">
            <h2>Hola ${data.customerName},</h2>
            <p>Tu cita ha sido confirmada exitosamente. Aquí están los detalles:</p>
            
            <div class="appointment-details">
              <h3>📅 Detalles de la Cita</h3>
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Fecha:</strong> ${data.appointmentDate}</p>
              <p><strong>Hora:</strong> ${data.appointmentTime}</p>
              <p><strong>Duración:</strong> ${data.duration} minutos</p>
              ${data.businessAddress ? `<p><strong>Dirección:</strong> ${data.businessAddress}</p>` : ''}
              <p><strong>Teléfono:</strong> ${data.businessPhone}</p>
            </div>

            <p><strong>📋 Preparación:</strong></p>
            <ul>
              <li>Llega 5-10 minutos antes de tu cita</li>
              <li>Trae cualquier documento necesario</li>
              <li>Si necesitas cancelar o reagendar, hazlo con al menos 2 horas de anticipación</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.cancelLink}" class="button">❌ Cancelar Cita</a>
            </div>

            <p><strong>⚠️ Importante:</strong> Al hacer clic en "Cancelar Cita" serás dirigido a una página de confirmación donde se procesará tu solicitud.</p>

            <p>Si tienes alguna pregunta, no dudes en contactarnos al ${data.businessPhone}.</p>
            
            <p>¡Esperamos verte pronto!</p>
            <p><strong>El equipo de ${data.businessName}</strong></p>
          </div>
          <div class="footer">
            <p>Este email fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
            <p>Powered by AgendaGo</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Confirmación de Cita - ${data.businessName}

Hola ${data.customerName},

Tu cita ha sido confirmada exitosamente. Aquí están los detalles:

DETALLES DE LA CITA:
Servicio: ${data.serviceName}
Fecha: ${data.appointmentDate}
Hora: ${data.appointmentTime}
Duración: ${data.duration} minutos
${data.businessAddress ? `Dirección: ${data.businessAddress}` : ''}
Teléfono: ${data.businessPhone}

PREPARACIÓN:
- Llega 5-10 minutos antes de tu cita
- Trae cualquier documento necesario
- Si necesitas cancelar o reagendar, hazlo con al menos 2 horas de anticipación

CANCELAR CITA: ${data.cancelLink}

⚠️ IMPORTANTE: Al hacer clic en el enlace de cancelación serás dirigido a una página de confirmación donde se procesará tu solicitud.

Si tienes alguna pregunta, no dudes en contactarnos al ${data.businessPhone}.

¡Esperamos verte pronto!

El equipo de ${data.businessName}

---
Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
Powered by AgendaGo
    `
  }),

  appointmentReminder: (data: {
    customerName: string
    businessName: string
    serviceName: string
    appointmentDate: string
    appointmentTime: string
    businessPhone: string
    businessAddress?: string
    confirmLink: string
    cancelLink: string
  }): EmailTemplate => ({
    subject: `Recordatorio de cita mañana - ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
          .button { display: inline-block; padding: 12px 24px; color: white; text-decoration: none; border-radius: 5px; margin: 5px; font-weight: bold; }
          .confirm { background: #28a745; }
          .cancel { background: #dc3545; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Recordatorio de Cita</h1>
            <p>${data.businessName}</p>
          </div>
          <div class="content">
            <h2>Hola ${data.customerName},</h2>
            <p>Este es un recordatorio amistoso de que tienes una cita programada para <strong>mañana</strong>.</p>
            
            <div class="appointment-details">
              <h3>📅 Tu Cita de Mañana</h3>
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Fecha:</strong> ${data.appointmentDate}</p>
              <p><strong>Hora:</strong> ${data.appointmentTime}</p>
              ${data.businessAddress ? `<p><strong>Dirección:</strong> ${data.businessAddress}</p>` : ''}
              <p><strong>Teléfono:</strong> ${data.businessPhone}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.confirmLink}" class="button confirm">✅ Confirmar Asistencia</a>
              <a href="${data.cancelLink}" class="button cancel">❌ Cancelar Cita</a>
            </div>

            <p><strong>💡 ¿Necesitas ayuda?</strong></p>
            <ul>
              <li>Para reagendar: Contáctanos al ${data.businessPhone}</li>
              <li>Para cancelar: Usa el botón arriba (serás dirigido a una página de confirmación)</li>
              <li>Dirección: ${data.businessAddress || 'Verificar por teléfono'}</li>
            </ul>

            <p>¡Esperamos verte mañana!</p>
            <p><strong>El equipo de ${data.businessName}</strong></p>
          </div>
          <div class="footer">
            <p>Este email fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
            <p>Powered by AgendaGo</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Recordatorio de cita mañana - ${data.businessName}

Hola ${data.customerName},

Este es un recordatorio amistoso de que tienes una cita programada para MAÑANA.

TU CITA DE MAÑANA:
Servicio: ${data.serviceName}
Fecha: ${data.appointmentDate}
Hora: ${data.appointmentTime}
${data.businessAddress ? `Dirección: ${data.businessAddress}` : ''}
Teléfono: ${data.businessPhone}

ACCIONES RÁPIDAS:
Confirmar asistencia: ${data.confirmLink}
Cancelar cita: ${data.cancelLink}

¿NECESITAS AYUDA?
- Para reagendar: Contáctanos al ${data.businessPhone}
- Para cancelar: Usa el link de cancelación (serás dirigido a una página de confirmación)
- Dirección: ${data.businessAddress || 'Verificar por teléfono'}

¡Esperamos verte mañana!

El equipo de ${data.businessName}

---
Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
Powered by AgendaGo
    `
  }),

  appointmentCancellation: (data: {
    customerName: string
    businessName: string
    serviceName: string
    appointmentDate: string
    appointmentTime: string
    businessPhone: string
    rescheduleLink: string
  }): EmailTemplate => ({
    subject: `Cancelación de cita - ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #868f96 0%, #596164 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #868f96; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Cita Cancelada</h1>
            <p>${data.businessName}</p>
          </div>
          <div class="content">
            <h2>Hola ${data.customerName},</h2>
            <p>Tu cita ha sido cancelada exitosamente. Lamentamos que no puedas asistir.</p>
            
            <div class="appointment-details">
              <h3>Cita Cancelada</h3>
              <p><strong>Servicio:</strong> ${data.serviceName}</p>
              <p><strong>Fecha:</strong> ${data.appointmentDate}</p>
              <p><strong>Hora:</strong> ${data.appointmentTime}</p>
            </div>

            <p>¿Te gustaría reagendar para otro momento?</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.rescheduleLink}" class="button">📅 Reagendar Cita</a>
            </div>

            <p>Si cambias de opinión o necesitas ayuda, contáctanos al ${data.businessPhone}.</p>
            
            <p>Esperamos poder servirte en el futuro.</p>
            <p><strong>El equipo de ${data.businessName}</strong></p>
          </div>
          <div class="footer">
            <p>Este email fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
            <p>Powered by AgendaGo</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Cancelación de cita - ${data.businessName}

Hola ${data.customerName},

Tu cita ha sido cancelada exitosamente. Lamentamos que no puedas asistir.

CITA CANCELADA:
Servicio: ${data.serviceName}
Fecha: ${data.appointmentDate}
Hora: ${data.appointmentTime}

¿Te gustaría reagendar para otro momento?
Reagendar: ${data.rescheduleLink}

Si cambias de opinión o necesitas ayuda, contáctanos al ${data.businessPhone}.

Esperamos poder servirte en el futuro.

El equipo de ${data.businessName}

---
Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
Powered by AgendaGo
    `
  })
}