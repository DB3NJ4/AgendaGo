import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { mockDb } from '@/lib/mock-db'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, address, phone, email, category } = body

    // Validaciones
    if (!name || !slug) {
      return NextResponse.json({ error: 'Nombre y slug son requeridos' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    let dbUser = await mockDb.user.findUnique({
      where: { clerkId: user.id }
    })

    // Si no existe, crearlo
    if (!dbUser) {
      dbUser = await mockDb.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName
        }
      })
    }

    // Verificar si el slug ya está en uso
    const existingBusiness = await mockDb.business.findUnique({
      where: { slug }
    })

    if (existingBusiness) {
      return NextResponse.json({ error: 'Esta URL ya está en uso' }, { status: 400 })
    }

    // Crear el negocio
    const business = await mockDb.business.create({
      data: {
        name,
        slug,
        description,
        address,
        phone,
        email: email || user.emailAddresses[0].emailAddress,
        category,
        isActive: true,
        userId: dbUser.id
      }
    })

    // Crear horarios por defecto
    const defaultHours = [
      { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00' },
      { dayOfWeek: 6, openTime: '10:00', closeTime: '14:00' },
      { dayOfWeek: 0, isClosed: true }
    ]

    await mockDb.businessHours.createMany({
      data: defaultHours.map(hours => ({
        ...hours,
        businessId: business.id
      }))
    })

    // Crear suscripción básica
    await mockDb.subscription.create({
      data: {
        plan: 'basic',
        status: 'active',
        price: 5000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        businessId: business.id
      }
    })

    // Crear servicios por defecto
    const defaultServices = [
      {
        name: 'Corte de Cabello',
        description: 'Corte moderno y personalizado',
        duration: 30,
        price: 15000,
        category: 'Cortes',
        isActive: true,
        businessId: business.id
      },
      {
        name: 'Arreglo de Barba',
        description: 'Afeitado y diseño de barba',
        duration: 20,
        price: 8000,
        category: 'Barba',
        isActive: true,
        businessId: business.id
      }
    ]

    for (const serviceData of defaultServices) {
      await mockDb.service.create({
        data: serviceData
      })
    }

    return NextResponse.json({ 
      success: true, 
      business,
      message: 'Negocio creado exitosamente' 
    })

  } catch (error) {
    console.error('Error creando negocio:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}