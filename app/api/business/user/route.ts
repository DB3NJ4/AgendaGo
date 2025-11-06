// app/api/business/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    console.log('🔍 User ID from getAuth:', userId)

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar o CREAR usuario en nuestra DB
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      console.log('👤 Usuario no encontrado en DB, creando...')
      // Crear usuario básico
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `user-${userId}@temp.com`, // Email temporal
          firstName: '',
          lastName: ''
        }
      })
      console.log('✅ Usuario creado:', dbUser.id)
      // Retornar que no tiene negocio
      return NextResponse.json({ 
        hasBusiness: false, 
        business: null,
        message: 'Usuario creado, necesita crear negocio'
      })
    }

    console.log('📋 Usuario encontrado en DB:', dbUser.id)

    // Buscar negocios del usuario
    const userBusinesses = await prisma.business.findMany({
      where: { userId: dbUser.id },
      include: {
        services: true,
        businessHours: true,
      }
    })

    console.log('🏢 Negocios encontrados:', userBusinesses.length)

    const hasBusiness = userBusinesses.length > 0
    const business = hasBusiness ? userBusinesses[0] : null

    return NextResponse.json({
      hasBusiness,
      business,
      debug: {
        userId: dbUser.id,
        clerkId: userId,
        businessesCount: userBusinesses.length
      }
    })

  } catch (error) {
    console.error('❌ Error en API business/user:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        hasBusiness: false,
        business: null
      }, 
      { status: 500 }
    )
  }
}