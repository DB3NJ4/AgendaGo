'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Plus, Clock, DollarSign, Search, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  isActive: boolean
  category: string
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte de Cabello',
    description: 'Corte moderno y personalizado',
    duration: 30,
    price: 15000,
    isActive: true,
    category: 'Cortes'
  },
  {
    id: '2',
    name: 'Arreglo de Barba',
    description: 'Afeitado y diseño de barba',
    duration: 20,
    price: 8000,
    isActive: true,
    category: 'Barba'
  },
  {
    id: '3',
    name: 'Corte + Barba',
    description: 'Combo completo de corte y arreglo de barba',
    duration: 45,
    price: 20000,
    isActive: true,
    category: 'Combos'
  },
  {
    id: '4',
    name: 'Afeitado Clásico',
    description: 'Afeitado tradicional con navaja',
    duration: 25,
    price: 12000,
    isActive: false,
    category: 'Barba'
  }
]

export function ServicesList() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = ['all', ...new Set(mockServices.map(service => service.category))]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const toggleServiceStatus = (serviceId: string) => {
    setServices(prev => prev.map(service =>
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ))
  }

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    return `${minutes} min`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Servicios</CardTitle>
            <CardDescription>
              Gestiona los servicios que ofrece tu negocio
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-slate-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatPrice(service.price)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Editar Servicio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleServiceStatus(service.id)}>
                    {service.isActive ? 'Desactivar' : 'Activar'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteService(service.id)}
                    className="text-red-600"
                  >
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron servicios</p>
              <Button variant="outline" className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Crear primer servicio
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}