// app/api/business/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    console.log('🔐 User ID from auth:', userId)

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, phone, address } = body

    console.log('📝 Datos del negocio recibidos:', body)

    // Buscar usuario en nuestra DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      console.log('❌ Usuario no encontrado en DB')
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    console.log('👤 Usuario encontrado en DB:', dbUser.id)

    // Crear slug único
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    // Verificar si el slug ya existe y hacerlo único
    let slug = baseSlug
    let counter = 1
    while (await prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    console.log('🏷️ Slug generado:', slug)

    // Crear el negocio
    const business = await prisma.business.create({
      data: {
        name,
        description: description || '',
        category: category || 'general',
        phone: phone || '',
        address: address || '',
        slug: slug,
        userId: dbUser.id,
        // Crear horarios por defecto
        businessHours: {
          create: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' }, // Lunes
            { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' }, // Martes
            { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' }, // Miércoles
            { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' }, // Jueves
            { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00' }, // Viernes
            { dayOfWeek: 6, openTime: '09:00', closeTime: '14:00' }, // Sábado
            { dayOfWeek: 0, isClosed: true } // Domingo
          ]
        }
      },
      include: {
        businessHours: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log('✅ Negocio creado exitosamente!')
    console.log('🏢 ID:', business.id)
    console.log('🏢 Nombre:', business.name)
    console.log('🏢 Slug:', business.slug)
    console.log('🏢 Horarios creados:', business.businessHours.length)

    return NextResponse.json({ 
      success: true, 
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        category: business.category,
        phone: business.phone,
        address: business.address
      },
      message: 'Negocio creado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error creando negocio:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'