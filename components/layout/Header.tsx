'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()

  if (loading) return null

  return (
    <nav style={{ display: 'flex', gap: 12, padding: 16, borderBottom: '1px solid #eee' }}>
      <a href="/">Home</a>

      {user ? (
        <>
          <a href="/dashboard">Dashboard</a>
          <button
            onClick={async () => {
              await signOut()
              router.push('/login')
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </>
      )}
    </nav>
  )
}
