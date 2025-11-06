// app/debug/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'

export default async function DebugPage() {
  const user = await currentUser()
  const headersList = await headers()
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/business/user`, {
      headers: {
        'Cookie': headersList.get('cookie') || ''
      },
      cache: 'no-store'
    })
    
    let data
    if (response.ok) {
      data = await response.json()
    } else {
      data = { error: `HTTP ${response.status}: ${response.statusText}` }
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">User Info (Server Component)</h2>
            <pre className="text-sm">{JSON.stringify({
              id: user?.id,
              firstName: user?.firstName,
              email: user?.emailAddresses?.[0]?.emailAddress,
              hasImage: !!user?.imageUrl
            }, null, 2)}</pre>
          </div>
          
          <div className="p-4 border rounded">
            <h2 className="font-bold mb-2">API Response</h2>
            <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>

        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold mb-2">Auth Test Links</h2>
          <div className="space-y-2">
            <a href="/api/business/user" className="block text-blue-600 hover:underline" target="_blank">
              /api/business/user (direct link)
            </a>
            <a href="/dashboard" className="block text-blue-600 hover:underline">
              /dashboard
            </a>
            <a href="/onboarding" className="block text-blue-600 hover:underline">
              /onboarding
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Debug Error</h1>
        <pre className="text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    )
  }
}