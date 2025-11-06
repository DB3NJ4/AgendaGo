// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar el negocio del usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        businesses: {
          include: {
            services: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ services: [] })
    }

    const business = user.businesses[0]
    return NextResponse.json({ services: business.services })

  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, duration, price, category, isActive } = body

    // Validaciones
    if (!name || !duration || !price) {
      return NextResponse.json({ error: 'Nombre, duración y precio son requeridos' }, { status: 400 })
    }

    // Buscar el negocio del usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { businesses: true }
    })

    if (!user || user.businesses.length === 0) {
      return NextResponse.json({ error: 'No se encontró un negocio' }, { status: 404 })
    }

    const business = user.businesses[0]

    // Crear el servicio
    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        duration: parseInt(duration),
        price: parseInt(price),
        category: category || '',
        isActive: isActive !== false, // default true
        businessId: business.id
      }
    })

    return NextResponse.json({ service })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}