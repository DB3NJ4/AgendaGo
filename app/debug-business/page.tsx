// app/debug-business/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export default async function DebugBusinessPage() {
  const user = await currentUser()
  
  if (!user) {
    return <div className="p-6">No autenticado</div>
  }

  try {
    // Buscar usuario en DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return <div className="p-6">Usuario no encontrado en DB</div>
    }

    // Buscar todos los negocios de este usuario
    const businesses = await prisma.business.findMany({
      where: { userId: dbUser.id },
      include: {
        businessHours: true,
        services: true,
        appointments: true
      }
    })

    // Buscar todos los usuarios (solo para debug)
    const allUsers = await prisma.user.findMany({
      select: { id: true, clerkId: true, email: true, firstName: true }
    })

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Debug - Base de Datos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">Usuario Actual</h2>
            <pre className="text-sm">{JSON.stringify({
              clerkId: user.id,
              dbUserId: dbUser.id,
              email: dbUser.email,
              firstName: dbUser.firstName
            }, null, 2)}</pre>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">Negocios ({businesses.length})</h2>
            {businesses.length === 0 ? (
              <p className="text-red-600">❌ No hay negocios creados</p>
            ) : (
              <pre className="text-sm">{JSON.stringify(businesses, null, 2)}</pre>
            )}
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Todos los Usuarios en DB ({allUsers.length})</h2>
          <pre className="text-sm">{JSON.stringify(allUsers, null, 2)}</pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Pruebas Rápidas</h2>
          <div className="space-y-2">
            <a href="/api/business/user" className="block text-blue-600 hover:underline" target="_blank">
              🔍 /api/business/user
            </a>
            <a href="/dashboard" className="block text-blue-600 hover:underline">
              📊 /dashboard
            </a>
            <a href="/onboarding" className="block text-blue-600 hover:underline">
              🏢 /onboarding
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    )
  }
}