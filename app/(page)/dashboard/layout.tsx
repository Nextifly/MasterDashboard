'use client'

import Header from '@/components/Header/Header'
import { useAccessToken, useRefreshToken } from '@/lib/store/store'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'

interface IToken {
	role: string
	email: string
	exp: number
}

export default function DashboardLayout ({children}: {children: ReactNode}) {
		const router = useRouter()
		const [emailData, setEmailData] = useState<string>()
		const { accessToken, deleteAccessToken } = useAccessToken()
		const { refreshToken, deleteRefreshToken } = useRefreshToken()

		useEffect(() => {
		try {
			const decoded: IToken = jwtDecode<JwtPayload>(
				window.localStorage.getItem('accessToken') as string
			) as IToken
			const currentTimeMs = Date.now();
			const expMs = decoded.exp * 1000;
			if (currentTimeMs >= expMs ) {
				deleteAccessToken()
				deleteRefreshToken()
				router.push('/auth/signin')
			}
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