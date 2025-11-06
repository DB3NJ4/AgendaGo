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
    const { name, slug, description, category, phone, address, email } = body

    console.log('📝 Datos recibidos del frontend:', body)

    // Buscar o CREAR usuario en nuestra DB
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      console.log('👤 Usuario no encontrado, creando nuevo usuario...')
      
      // Para obtener más información del usuario de Clerk, podrías necesitar la API de Clerk
      // Por ahora creamos con los datos básicos
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email || `user-${userId}@temp.com`, // Usar email del form o temporal
          firstName: '', // Podrías obtener esto de Clerk si está disponible
          lastName: ''
        }
      })
      console.log('✅ Usuario creado:', dbUser.id)
    } else {
      console.log('👤 Usuario encontrado en DB:', dbUser.id)
    }

    // Verificar si el slug ya existe
    const existingBusiness = await prisma.business.findUnique({
      where: { slug }
    })

    if (existingBusiness) {
      console.log('❌ Slug ya existe:', slug)
      return NextResponse.json(
        { error: 'Esta URL ya está en uso. Por favor elige otra.' }, 
        { status: 400 }
      )
    }

    console.log('✅ Slug disponible:', slug)

    // Crear el negocio
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        description: description || '',
        category: category || 'general',
        phone: phone || '',
        address: address || '',
        email: email || null,
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
        address: business.address,
        email: business.email
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