'use client'

import { useState } from 'react'
import { signUp } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async () => {
    setError('')
    setMessage('')

    if (!email.includes('@')) {
      setError('Invalid email')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      })

      if (result.isSignUpComplete) {
        setMessage('Sign up complete. You can now log in.')
        router.push('/login')
      } else {
        setMessage('Verification code sent to your email.')
        router.push('/confirm')
      }
    } catch (err: any) {
       console.error('🔴 Amplify signUp error:', err)

  if (err.message?.includes('already exists')) {
        setError('This email is already registered.')
      } else if (err.name === 'InvalidParameterException') {
        setError('Invalid sign-up parameters.')
      } else if (err.name === 'AuthError') {
        setError('Auth configuration error.')
      } else {
        setError(err.message || 'Sign up failed.')
      }
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%' }}
      />
      <button onClick={handleSignUp} style={{ width: '100%' }}>
        Sign Up
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
