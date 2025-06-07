'use client'

import { useAccessToken } from '@/lib/store/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Home = () => {
  const router = useRouter()
  const { accessToken } = useAccessToken()

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/signup')
    } else {
      router.push('/dashboard/statements')
    }
  }, [])

  return (
    <>
    </>
  )
}

export default Home