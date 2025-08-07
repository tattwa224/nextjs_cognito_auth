'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'aws-amplify/auth'

// Email regex validator
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setIsSubmitting(true)

  try {
    const result = await signIn({ username: email, password })

    if (result.isSignedIn) {
      router.push('/dashboard')
    } else {
      setError('Authentication failed. Please try again.')
    }
  } catch (err: unknown) {
    let message = 'An unexpected error occurred. Please try again.'

    // Narrow type check
    if (typeof err === 'object' && err !== null && 'name' in err) {
      const authError = err as { name: string; message?: string }

      switch (authError.name) {
        case 'NotAuthorizedException':
        case 'UserNotFoundException':
          message = 'Invalid email or password.'
          break
        case 'UserNotConfirmedException':
          message = 'Account not confirmed. Please check your email.'
          break
        case 'TooManyFailedAttemptsException':
        case 'LimitExceededException':
          message = 'Too many attempts. Please try again later.'
          break
        default:
          message = authError.message || message
      }
    }

    // Avoid direct error logging to console in production
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Login error (safe):', JSON.stringify(err, null, 2))
    }

    setError(message)
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Log In</h2>

      <form onSubmit={handleLogin} noValidate>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  )
}
