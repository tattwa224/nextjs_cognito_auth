'use client'

import { Amplify } from 'aws-amplify'
import awsconfig from '@/lib/aws-config'
import { ReactNode, useEffect } from 'react'

Amplify.configure(awsconfig)

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    console.log('✅ Amplify configured using Gen 2 Auth structure')
    console.log('✅ Amplify configured with:', awsconfig)
  }, [])

  return <>{children}</>
}
