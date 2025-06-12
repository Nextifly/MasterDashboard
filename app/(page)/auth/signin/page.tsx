'use client'

import { useSignInMutation } from '@/lib/redux/api/Auth/AuthApi'
import { useAccessToken, useRefreshToken } from '@/lib/store/store'
import AuthButton from '@/ui/button/AuthButton'
import AuthInput from '@/ui/input/AuthInput'
import AuthLink from '@/ui/text/AuthLink'
import AuthTitle from '@/ui/text/AuthTitle'
import { myToast } from '@/ui/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SignIn = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [signIn] = useSignInMutation()
	const { setAccessToken } = useAccessToken()
	const { setRefreshToken } = useRefreshToken()
	const router = useRouter()

	const handleClick = async () => {
		if (!email) return myToast({ message: 'Введите email', type: 'error' })
		if (!password) return myToast({ message: 'Введите пароль', type: 'error' })

		const user = {
			email,
			password,
		}

		try {
			alert(user.email)
			const response = await signIn(user)
			if (response?.data) {
				const accessToken = response.data.accessToken!
				const refreshToken = response.data.refreshToken!
				setAccessToken(accessToken!)
				setRefreshToken(refreshToken!)
				myToast({ message: 'Успешно!', type: 'success' })
				setTimeout(() => {
					router.push('/dashboard/statements')
				}, 2500)
			} else {
				console.log(response.error)
				myToast({ message: 'Неверные данные!', type: 'error' })
			}
		} catch (e) {
			myToast({ message: 'Ошибка!', type: 'error' })
		}
	}

	return (
		<>
			<AuthTitle value='Войти' />
			<AuthInput placeholder='E-mail' type='text' onChange={setEmail} />
			<AuthInput placeholder='Пароль' type='password' onChange={setPassword} />
			<AuthButton onClick={handleClick} text='Войти' />
			{/* <Link
				href='/auth/forgot'
				className='text-[#807E7E] text-2xl font-bold mt-7'
			>
				Забыли пароль?
			</Link> */}
			<AuthLink link='/auth/signup' value='Зарегистрировать новый аккаунт' />
		</>
	)
}

export default SignIn
