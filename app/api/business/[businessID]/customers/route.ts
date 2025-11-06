// app/api/business/[businessId]/customers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Obtener clientes que han tenido citas en este negocio
    const customers = await prisma.customer.findMany({
      where: {
        appointments: {
          some: {
            businessId: params.businessId
          }
        },
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } }
        ]
      },
      include: {
        appointments: {
          where: {
            businessId: params.businessId
          },
          orderBy: {
            appointmentDate: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            appointments: {
              where: {
                businessId: params.businessId
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await prisma.customer.count({
      where: {
        appointments: {
          some: {
            businessId: params.businessId
          }
        }
      }
    })

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}