import { notFound } from "next/navigation"

// Datos mock del negocio (luego vendrán de la base de datos)
const mockBusinesses = {
  "barberia-el-corte": {
    name: "Barbería El Corte",
    description: "Barbería tradicional con los mejores cortes y afeitados clásicos desde 2010",
    address: "Av. Principal 123, Santiago Centro",
    phone: "+56912345678",
    email: "contacto@barberiaelcorte.cl",
    rating: 4.8,
    reviewCount: 124,
    services: ["Corte de Pelo", "Barba", "Afeitado Clásico", "Tratamientos Capilares"],
    hours: {
      monday: "9:00 - 19:00",
      tuesday: "9:00 - 19:00", 
      wednesday: "9:00 - 19:00",
      thursday: "9:00 - 19:00",
      friday: "9:00 - 20:00",
      saturday: "10:00 - 18:00",
      sunday: "Cerrado"
    }
  },
  "belleza-natural": {
    name: "Belleza Natural Spa",
    description: "Spa especializado en tratamientos faciales y corporales",
    address: "Mall Plaza Egaña, Local 245, La Reina",
    phone: "+56987654321",
    email: "hola@bellezanatural.cl",
    rating: 4.9,
    reviewCount: 89,
    services: ["Faciales", "Masajes", "Depilación", "Manicure", "Pedicure"],
    hours: {
      monday: "10:00 - 20:00",
      tuesday: "10:00 - 20:00",
      wednesday: "10:00 - 20:00", 
      thursday: "10:00 - 20:00",
      friday: "10:00 - 21:00",
      saturday: "11:00 - 19:00",
      sunday: "Cerrado"
    }
  }
}

interface PageProps {
  params: Promise<{
    business: string
  }>
}

export default async function BusinessPage({ params }: PageProps) {
  // Esperar los params (Next.js 14 App Router)
  const { business: businessSlug } = await params
  
  const business = mockBusinesses[businessSlug as keyof typeof mockBusinesses]

  // Si el negocio no existe, mostrar 404
  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">{business.name}</h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {business.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`/${businessSlug}/booking`}
                className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-lg"
              >
                Reservar una Cita
              </a>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors text-lg">
                Ver Servicios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Negocio */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Información</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Contacto</h3>
                <p className="text-slate-600">{business.phone}</p>
                <p className="text-slate-600">{business.email}</p>
                <p className="text-slate-600">{business.address}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Horarios de Atención</h3>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Lunes - Jueves:</span>
                    <span>{business.hours.monday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Viernes:</span>
                    <span>{business.hours.friday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>{business.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>{business.hours.sunday}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Calificación</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-slate-600">({business.reviewCount} reseñas)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {business.services.map((service, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-slate-400 transition-colors">
                  <h3 className="font-semibold text-lg">{service}</h3>
                  <p className="text-slate-600 text-sm mt-1">Servicio profesional</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">¿Listo para tu cita?</h3>
              <p className="text-slate-600 mb-4">
                Reserva fácilmente online y elige el horario que más te convenga.
              </p>
              <a 
                href={`/${businessSlug}/booking`}
                className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Reservar Ahora
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-600">
          <p>Powered by <span className="font-semibold">AgendaGo</span></p>
        </div>
      </div>
    </div>
  )
}