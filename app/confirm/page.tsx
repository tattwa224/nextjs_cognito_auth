'use client'

import { useState } from 'react'
import { confirmSignUp } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !code) {
      setError('Email and confirmation code are required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await confirmSignUp({ username: email, confirmationCode: code })

      if (result.isSignUpComplete) {
        setMessage('✅ Account confirmed! You can now log in.')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setMessage('🔄 Confirmation incomplete. Try again.')
      }
    } catch (err: any) {
      console.error('🔴 Confirm SignUp Error:', err)
      setError(err.message || 'Confirmation failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Confirm Sign Up</h2>

      <form onSubmit={handleConfirm}>
        <input
          type="email"
          placeholder="Email (used during signup)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
          required
        />

        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
          {isSubmitting ? 'Verifying...' : 'Confirm'}
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  )
}
