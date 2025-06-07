'use client'

import Header from '@/components/Header/Header'
import { useAccessToken, useRefreshToken } from '@/lib/store/store'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'

interface IToken {
	role: string
	email: string
}

export default function DashboardLayout ({children}: {children: ReactNode}) {
		const router = useRouter()
		const [emailData, setEmailData] = useState<string>()
		const { accessToken } = useAccessToken()
		const { refreshToken } = useRefreshToken()

		useEffect(() => {
		try {
			const decoded: IToken = jwtDecode<JwtPayload>(
				window.localStorage.getItem('accessToken') as string
			) as IToken
			setEmailData(decoded.email)
		} catch (error) {
			router.push('/auth/signup')
		}
	}, [])
	
	return (
		<>
			<Header accessToken={accessToken!} refreshToken={refreshToken!} email={emailData!} />
			{children}
		</>
	)
}