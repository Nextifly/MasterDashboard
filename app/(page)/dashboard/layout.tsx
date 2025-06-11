'use client'

import Header from '@/components/Header/Header'
import { useUpdateTokenMutation } from '@/lib/redux/api/Auth/AuthApi'
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
		const { accessToken, setAccessToken } = useAccessToken()
		const { refreshToken, setRefreshToken } = useRefreshToken()
		const [updateToken] = useUpdateTokenMutation()

		useEffect(() => {
		try {
			const decoded: IToken = jwtDecode<JwtPayload>(
				window.localStorage.getItem('accessToken') as string
			) as IToken
			const currentTimeMs = Date.now();
			const expMs = decoded.exp * 1000;
			if (currentTimeMs >= expMs ) {
				const refreshTokenFunc = async () => {
					const response = await updateToken(refreshToken!)
					if (response.error) {
						router.push('/auth/signin')
					} else {
						setAccessToken(response.data.accessToken!)
						setRefreshToken(response.data.refreshToken!)
					}
				}
				refreshTokenFunc()
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