import { currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, Users, DollarSign, TrendingUp, Plus, Clock, ArrowRight, CreditCard } from 'lucide-react'

// Mock data - se usarán si no hay datos reales
const mockBusinessStats = {
  totalAppointments: 12,
  upcomingAppointments: 3,
  monthlyRevenue: 184000,
  newCustomers: 5
}

const upcomingAppointments = [
  { id: '1', customer: 'Juan Pérez', service: 'Corte de Pelo', time: 'Hoy 10:00 AM' },
  { id: '2', customer: 'María González', service: 'Arreglo de Barba', time: 'Hoy 2:00 PM' },
  { id: '3', customer: 'Carlos López', service: 'Corte y Barba', time: 'Mañana 11:00 AM' }
]

// Función para obtener estadísticas del negocio (mock por ahora)
async function getBusinessStats(businessId: string) {
  // Aquí iría la llamada real a la base de datos
  return mockBusinessStats
}

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  let hasBusiness = false
  let business = null
  let businessStats = mockBusinessStats

  // Verificar si el usuario tiene negocio en la base de datos
  try {
    const headersList = await headers()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/business/user`, {
      headers: {
        'Cookie': headersList.get('cookie') || ''
      },
      cache: 'no-store' // Para evitar cache en desarrollo
    })
    
    if (response.ok) {
      const data = await response.json()
      hasBusiness = data.hasBusiness
      business = data.business
      
      if (hasBusiness && business) {
        // Usar datos reales del negocio
        businessStats = await getBusinessStats(business.id)
      } else {
        redirect('/onboarding')
      }
    } else {
      console.error('Error en la respuesta:', response.status)
      redirect('/onboarding')
    }
    
  } catch (error) {
    console.error('Error verificando negocio:', error)
    redirect('/onboarding')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hola, {user.firstName || 'Usuario'} 👋
          </h1>
          <p className="text-slate-600 mt-2">
            Bienvenido a tu panel de AgendaGo
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            <Calendar className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessStats.totalAppointments}</div>
            <p className="text-xs text-slate-600">+2 desde la semana pasada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
            <Clock className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{businessStats.upcomingAppointments}</div>
            <p className="text-xs text-slate-600">Para hoy y mañana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${businessStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-600">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{businessStats.newCustomers}</div>
            <p className="text-xs text-slate-600">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Info de Suscripción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tu Suscripción</span>
            <Badge variant="outline">Básico</Badge>
          </CardTitle>
          <CardDescription>
            Gestiona tu plan y método de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Plan Básico - $5.000/mes</p>
              <p className="text-sm text-slate-600">Renovación: 15 Dic 2024</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Gestionar Suscripción
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestiona tu negocio rápidamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Servicio
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Ver Calendario Completo
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Gestionar Clientes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Ver Reportes de Ingresos
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
            <CardDescription>Tus citas programadas para hoy y mañana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{appointment.customer}</h3>
                    <p className="text-sm text-slate-600">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{appointment.time}</p>
                    <Button variant="ghost" size="sm" className="mt-1">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todas las Citas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Business URL Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <CardHeader>
          <CardTitle>Tu Página Web</CardTitle>
          <CardDescription className="text-slate-300">
            Comparte este enlace con tus clientes para que reserven citas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-mono">agendago.cl/mi-negocio</p>
              <p className="text-slate-300 text-sm mt-1">
                Los clientes pueden ver tus servicios y reservar citas 24/7
              </p>
            </div>
            <Button variant="secondary">
              Copiar Enlace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}