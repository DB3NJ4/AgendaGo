'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'
import { 
  Calendar, 
  Settings, 
  BarChart3, 
  Scissors, 
  LogOut,
  Home,
  Users,
  DollarSign,
  Globe,
  CreditCard
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Citas', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Servicios', href: '/dashboard/services', icon: Scissors },
  { name: 'Clientes', href: '/dashboard/clients', icon: Users },
  { name: 'Analíticas', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Ingresos', href: '/dashboard/revenue', icon: DollarSign },
  { name: 'Facturación', href: '/dashboard/billing', icon: CreditCard }, // ← Nueva
  { name: 'Mi Página', href: '/dashboard/website', icon: Globe },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 p-4">
        <h1 className="text-xl font-bold">AgendaGo</h1>
        <p className="text-slate-400 text-sm mt-1">Panel de Control</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-700">
        <SignOutButton>
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
            <LogOut className="mr-3 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </SignOutButton>
      </div>
    </div>
  )
}