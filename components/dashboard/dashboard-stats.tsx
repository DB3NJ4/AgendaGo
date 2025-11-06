// components/dashboard/dashboard-stats.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, DollarSign, TrendingUp, Clock, BarChart3 } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalAppointments?: number
    upcomingAppointments?: number
    monthlyRevenue?: number
    newCustomers?: number
    completedAppointments?: number
    cancellationRate?: number
  } | null
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const defaultStats = {
    totalAppointments: 0,
    upcomingAppointments: 0,
    monthlyRevenue: 0,
    newCustomers: 0,
    completedAppointments: 0,
    cancellationRate: 0
  }

  const data = stats || defaultStats

  const statsConfig = [
    {
      title: 'Total Citas',
      value: data.totalAppointments,
      description: 'Citas totales',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Próximas Citas',
      value: data.upcomingAppointments,
      description: 'Para hoy y mañana',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Ingresos Mensuales',
      value: data.monthlyRevenue,
      description: 'Este mes',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: 'currency'
    },
    {
      title: 'Nuevos Clientes',
      value: data.newCustomers,
      description: 'Este mes',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Completadas',
      value: data.completedAppointments,
      description: 'Citas finalizadas',
      icon: BarChart3,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Tasa de Cancelación',
      value: data.cancellationRate,
      description: 'Porcentaje',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      format: 'percentage'
    }
  ]

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(value)
    }
    
    if (format === 'percentage') {
      return `${value}%`
    }
    
    return value.toLocaleString('es-CL')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsConfig.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatValue(stat.value || 0, stat.format)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            
            {/* Indicador de tendencia */}
            {stat.value && stat.value > 0 && (
              <div className="absolute bottom-2 right-2">
                <div className={`text-xs ${
                  stat.title.includes('Cancelación') ? 'text-red-500' : 'text-green-500'
                }`}>
                  {stat.title.includes('Cancelación') ? '↗' : '↘'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}