// app/dashboard/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Plus, 
  Clock, 
  CreditCard, 
  Settings,
  BarChart3,
  Phone,
  CheckCircle,
  Globe,
  TrendingUp,
  Eye
} from 'lucide-react'
import { CopyLinkButton } from '@/components/copy-link-button'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { UpcomingAppointments } from '@/components/dashboard/upcoming-appointments'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  let businessData = null
  let statsData = null
  let upcomingAppointments = []

  try {
    const headersList = await headers()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/business/user`, {
      headers: {
        'Cookie': headersList.get('cookie') || ''
      },
      cache: 'no-store'
    })
    
    console.log('📊 Dashboard - Status:', response.status)
    
    const data = await response.json()
    console.log('📊 Dashboard - Data recibida:', data)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    if (!data.hasBusiness || !data.business) {
      console.log('🚨 No business found in API response')
      redirect('/onboarding')
    }
    
    businessData = data.business

    // Obtener estadísticas
    const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/stats`, {
      headers: {
        'Cookie': headersList.get('cookie') || ''
      },
      cache: 'no-store'
    })

    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      statsData = stats
    }

    // Obtener próximas citas
    const appointmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/appointments`, {
      headers: {
        'Cookie': headersList.get('cookie') || ''
      },
      cache: 'no-store'
    })

    if (appointmentsResponse.ok) {
      const appointments = await appointmentsResponse.json()
      upcomingAppointments = appointments.appointments || []
    }
    
  } catch (error) {
    console.error('❌ Error cargando dashboard:', error)
    redirect('/onboarding')
  }

  const businessUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${businessData.slug}`

  return (
    <div className="p-6 space-y-6">
      {/* Header con verificación */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h1 className="text-3xl font-bold text-slate-900">
              ¡Hola, {user.firstName || 'Usuario'}! 🎉
            </h1>
          </div>
          <p className="text-slate-600">
            Bienvenido al panel de <strong>{businessData.name}</strong>
          </p>
          <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
            ✅ Negocio activo
          </Badge>
        </div>
        <div className="flex space-x-3">
          <Button asChild variant="outline">
            <Link href={`/${businessData.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Ver Mi Página
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas en Tiempo Real */}
      <DashboardStats stats={statsData} />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Próximas Citas y Actividad Reciente */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingAppointments appointments={upcomingAppointments} />
          <RecentActivity businessId={businessData.id} />
        </div>

        {/* Columna Derecha - Información del Negocio y Acciones Rápidas */}
        <div className="space-y-6">
          {/* Información del Negocio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tu Negocio</span>
                <Badge variant="outline">{businessData.category}</Badge>
              </CardTitle>
              <CardDescription>
                Información de tu negocio en AgendaGo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-slate-500">Nombre</h4>
                  <p className="font-medium">{businessData.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-500">Categoría</h4>
                  <p className="font-medium">{businessData.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-500">Teléfono</h4>
                  <p className="font-medium">{businessData.phone}</p>
                </div>
                {businessData.address && (
                  <div>
                    <h4 className="font-semibold text-sm text-slate-500">Dirección</h4>
                    <p className="font-medium">{businessData.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business URL Card */}
          <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Tu Página Web Pública
              </CardTitle>
              <CardDescription className="text-slate-300">
                Comparte este enlace con tus clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xl font-mono bg-slate-800 px-3 py-2 rounded">
                    {businessUrl.replace('http://', '')}
                  </p>
                  <p className="text-slate-300 text-sm mt-2">
                    Los clientes pueden ver tus servicios y reservar citas 24/7
                  </p>
                </div>
                <CopyLinkButton url={businessUrl} />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tu negocio rápidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/services">
                    <Plus className="mr-2 h-4 w-4" />
                    Gestionar Servicios
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/appointments">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Calendario
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/customers">
                    <Users className="mr-2 h-4 w-4" />
                    Ver Clientes
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}