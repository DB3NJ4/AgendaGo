import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { mockDb } from '@/lib/mock-db'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar usuario en nuestra DB
    const dbUser = await mockDb.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ hasBusiness: false })
    }

    // Buscar negocios del usuario
    const userBusinesses = await mockDb.business.findMany({
      where: { userId: dbUser.id }
    })

    const hasBusiness = userBusinesses.length > 0
    const business = hasBusiness ? userBusinesses[0] : null

    return NextResponse.json({
      hasBusiness,
      business
    })

  } catch (error) {
    console.error('Error verificando negocio:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}