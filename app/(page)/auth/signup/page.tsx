'use client'

import { useSignUpMutation } from '@/lib/redux/api/Auth/AuthApi'
import AuthButton from '@/ui/button/AuthButton'
import AuthInput from '@/ui/input/AuthInput'
import AuthLink from '@/ui/text/AuthLink'
import AuthTitle from '@/ui/text/AuthTitle'
import { myToast } from '@/ui/toast'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

const SignUp = () => {
	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [signUp] = useSignUpMutation()
	const router = useRouter()

	const handleClick = async () => {
		if (!name) return myToast({ message: 'Введите имя!', type: 'error' })
		if (!email) return myToast({ message: 'Введите email!', type: 'error' })
		if (!password) return myToast({ message: 'Введите пароль!', type: 'error' })

		const user = {
			name,
			email,
			password,
		}

		try {
			const response = await signUp(user)
			if (response.data?.message || !response.data) {
				return myToast({ message: 'Аккаунт уже существует.', type: 'error' })
			} else {
				myToast({ message: 'Успешная регистрация.', type: 'error' })
				setTimeout(() => {
					router.push('/auth/signin')
				}, 2500)
			}
		} catch (e) {
			myToast({ message: 'Ошибка сервера.', type: 'error' })
		}
	}

	return (
		<>
			<AuthTitle value='Зарегистрироваться' />
			<AuthInput placeholder='Имя' type='text' onChange={setName} />
			<AuthInput placeholder='E-mail' type='text' onChange={setEmail} />
			<AuthInput placeholder='Пароль' type='password' onChange={setPassword} />
			<AuthButton onClick={handleClick} text='Зарегистрироваться' />
			<AuthLink link='/auth/signin' value='Войти в аккаунт' />
		</>
	)
}

export default SignUp
