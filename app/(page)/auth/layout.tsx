'use client'

import { useAccessToken } from '@/lib/store/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const router = useRouter()
	const { accessToken } = useAccessToken()

	useEffect(() => {
		if (accessToken) {
			router.push('/')
		}
	}, [])

	return (
		<section className='flex flex-col justify-center items-center'>
			<h2 className='uppercase text-2xl font-bold mt-30'>лого</h2>
			{children}
		</section>
	)
}
