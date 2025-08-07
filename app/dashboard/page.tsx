'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'aws-amplify/auth'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push('/login')
    } catch (err) {
      console.error('🔴 Sign-out failed:', err)
      setIsSigningOut(false)
    }
  }

  return (
    <AuthGuard>
      <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
        <h1>📊 Dashboard</h1>
        <p>You're logged in and viewing a protected route. ie The Dashboard page.</p>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            fontWeight: 'bold',
            cursor: isSigningOut ? 'not-allowed' : 'pointer',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
    </AuthGuard>
  )
}
