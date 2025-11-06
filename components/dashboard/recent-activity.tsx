// components/dashboard/recent-activity.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, DollarSign, Clock, TrendingUp } from 'lucide-react'

interface RecentActivityProps {
  businessId: string
}

interface Activity {
  id: string
  type: 'appointment_created' | 'appointment_completed' | 'appointment_cancelled' | 'service_created' | 'payment_received'
  description: string
  timestamp: string
  amount?: number
}

export function RecentActivity({ businessId }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [businessId])

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`/api/dashboard/activity?businessId=${businessId}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment_created':
      case 'appointment_completed':
      case 'appointment_cancelled':
        return Calendar
      case 'service_created':
        return TrendingUp
      case 'payment_received':
        return DollarSign
      default:
        return User
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'appointment_created':
      case 'service_created':
        return 'text-blue-600 bg-blue-50'
      case 'appointment_completed':
      case 'payment_received':
        return 'text-green-600 bg-green-50'
      case 'appointment_cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'appointment_created':
        return 'Nueva Cita'
      case 'appointment_completed':
        return 'Completada'
      case 'appointment_cancelled':
        return 'Cancelada'
      case 'service_created':
        return 'Nuevo Servicio'
      case 'payment_received':
        return 'Pago'
      default:
        return 'Actividad'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Cargando actividad...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>
          Últimas actividades en tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No hay actividad reciente</p>
            <p className="text-sm mt-2">Las actividades aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type)
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm">{activity.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {getActivityBadge(activity.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(activity.timestamp)}</span>
                      
                      {activity.amount && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-green-600">
                            +${activity.amount.toLocaleString('es-CL')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}