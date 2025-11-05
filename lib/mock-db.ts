// lib/mock-db.ts
// Base de datos en memoria para desarrollo

interface User {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: Date
  updatedAt: Date
}

interface Business {
  id: string
  name: string
  slug: string
  description?: string
  address?: string
  phone?: string
  email?: string
  category?: string
  logo?: string
  coverImage?: string
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  isActive: boolean
  category?: string
  businessId: string
  createdAt: Date
  updatedAt: Date
}

interface BusinessHours {
  id: string
  dayOfWeek: number
  openTime?: string
  closeTime?: string
  isClosed: boolean
  businessId: string
  createdAt: Date
  updatedAt: Date
}

interface Appointment {
  id: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  appointmentDate: Date
  duration: number
  status: string
  notes?: string
  businessId: string
  serviceId: string
  createdAt: Date
  updatedAt: Date
}

interface Subscription {
  id: string
  plan: string
  status: string
  price: number
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  businessId: string
  createdAt: Date
  updatedAt: Date
}

// Datos en memoria
let users: User[] = []
let businesses: Business[] = []
let services: Service[] = []
let appointments: Appointment[] = []
let subscriptions: Subscription[] = []
let businessHours: BusinessHours[] = []

export const mockDb = {
  // Users
  user: {
    findUnique: async ({ where }: { where: { clerkId?: string, id?: string } }): Promise<User | null> => {
      return users.find(user => {
        if (where.clerkId) return user.clerkId === where.clerkId
        if (where.id) return user.id === where.id
        return false
      }) || null
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }): Promise<User> => {
      const user: User = {
        id: `user_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      users.push(user)
      return user
    }
  },

  // Businesses
  business: {
    findUnique: async ({ where }: { where: { slug?: string, id?: string } }): Promise<Business | null> => {
      return businesses.find(business => {
        if (where.slug) return business.slug === where.slug
        if (where.id) return business.id === where.id
        return false
      }) || null
    },
    create: async ({ data }: { data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'> }): Promise<Business> => {
      const business: Business = {
        id: `business_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      businesses.push(business)
      return business
    },
    findMany: async ({ where }: { where?: { userId?: string } } = {}): Promise<Business[]> => {
      if (where?.userId) {
        return businesses.filter(b => b.userId === where.userId)
      }
      return businesses
    }
  },

  // Business Hours
  businessHours: {
    createMany: async ({ data }: { data: Omit<BusinessHours, 'id' | 'createdAt' | 'updatedAt'>[] }): Promise<{ count: number }> => {
      const hours = data.map(hourData => ({
        id: `hour_${Date.now()}_${Math.random()}`,
        ...hourData,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      businessHours.push(...hours)
      return { count: hours.length }
    }
  },

  // Subscriptions
  subscription: {
    create: async ({ data }: { data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> }): Promise<Subscription> => {
      const subscription: Subscription = {
        id: `sub_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      subscriptions.push(subscription)
      return subscription
    }
  },

  // Services
  service: {
    create: async ({ data }: { data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> }): Promise<Service> => {
      const service: Service = {
        id: `service_${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      services.push(service)
      return service
    },
    findMany: async ({ where }: { where?: { businessId?: string } } = {}): Promise<Service[]> => {
      if (where?.businessId) {
        return services.filter(s => s.businessId === where.businessId)
      }
      return services
    }
  }
}