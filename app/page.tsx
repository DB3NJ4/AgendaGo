// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-6">
            AgendaGo
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Sistema de reservas profesional para barberías, consultorios y más.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/sign-up">Comenzar Gratis</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">Ver Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}