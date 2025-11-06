// app/dashboard/services/page.tsx (actualizado)
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

      {/* Lista de Servicios */}
      <ServicesList onEditService={handleEditService} />

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