// hooks/useCurrentUser.ts
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
