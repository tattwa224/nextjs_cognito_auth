'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchAuthSession } from 'aws-amplify/auth'

interface Props {
  children: React.ReactNode
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession()
        const isLoggedIn = session.tokens?.accessToken != null

        if (!isLoggedIn) {
          router.push('/login') // Redirect if not logged in
        } else {
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('🔴 AuthGuard failed to fetch session:', err)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) return <p>🔐 Checking authentication...</p>
  if (!isAuthenticated) return null // Prevent flicker before redirect

  return <>{children}</>
}
