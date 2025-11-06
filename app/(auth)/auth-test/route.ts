// app/api/business/user/route.ts - VERSIÓN TEMPORAL
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Versión temporal que siempre retorna false
  return NextResponse.json({ 
    hasBusiness: false, 
    business: null,
    message: 'API funcionando - dirigir a onboarding'
  })
}

export const dynamic = 'force-dynamic'