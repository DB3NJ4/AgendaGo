// app/[business]/booking/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BookingWizard } from '@/components/booking/booking-wizard'

interface PageProps {
  params: Promise<{
    business: string
  }>
}

export default async function BookingPage({ params }: PageProps) {
  const { business: businessSlug } = await params
  
  // Buscar negocio en la base de datos
  const business = await prisma.business.findUnique({
    where: { 
      slug: businessSlug,
      isActive: true 
    },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { name: 'asc' }
      },
      businessHours: {
        orderBy: { dayOfWeek: 'asc' }
      }
    }
  })

  // Si el negocio no existe, mostrar 404
  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Reserva tu Cita en {business.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Agenda fácilmente online y elige el horario que más te convenga
            </p>
          </div>

          {/* Booking Wizard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <BookingWizard 
              business={business}
              services={business.services}
              businessHours={business.businessHours}
            />
          </div>

          {/* Business Info Footer */}
          <div className="mt-8 text-center text-gray-500">
            <p>Powered by <span className="font-semibold text-blue-600">AgendaGo</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}