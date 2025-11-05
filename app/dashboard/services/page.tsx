// app/dashboard/services/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ServicesList } from '@/components/dashboard/services-list'
import { ServiceModal } from '@/components/dashboard/service-modal'
import { Plus, BarChart3, DollarSign, Clock } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  isActive: boolean
  category: string
}

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const handleCreateService = () => {
    setModalMode('create')
    setSelectedService(null)
    setIsModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setModalMode('edit')
    setSelectedService(service)
    setIsModalOpen(true)
  }

  // Stats calculadas
  const totalServices = 4
  const activeServices = 3
  const averagePrice = 13750
  const totalDuration = 120

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Servicios</h1>
          <p className="text-slate-600 mt-2">
            Crea y gestiona los servicios que ofrece tu negocio
          </p>
        </div>
        <Button onClick={handleCreateService}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-slate-600">Servicios creados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeServices}</div>
            <p className="text-xs text-slate-600">Disponibles para booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toLocaleString()}</div>
            <p className="text-xs text-slate-600">Por servicio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duración Total</CardTitle>
            <Clock className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDuration} min</div>
            <p className="text-xs text-slate-600">Suma de todos los servicios</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Servicios */}
      <ServicesList />

      {/* Modal */}
      <ServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        mode={modalMode}
      />
    </div>
  )
}