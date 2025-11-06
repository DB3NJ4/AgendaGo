// components/dashboard/services-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Clock, DollarSign } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  isActive: boolean
  category: string
}

interface ServicesListProps {
  onEditService?: (service: Service) => void
}

export function ServicesList({ onEditService }: ServicesListProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setServices(services.filter(service => service.id !== serviceId))
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        setServices(services.map(service => 
          service.id === serviceId 
            ? { ...service, isActive: !currentStatus }
            : service
        ))
      }
    } catch (error) {
      console.error('Error updating service status:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando servicios...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Servicios</CardTitle>
        <CardDescription>
          {services.length} servicio(s) configurado(s) en tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No hay servicios configurados</p>
            <p className="text-sm mt-2">Crea tu primer servicio para empezar a recibir citas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold">{service.name}</h3>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {service.category && (
                      <Badge variant="outline">{service.category}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${service.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditService?.(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(service.id, service.isActive)}
                  >
                    {service.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}